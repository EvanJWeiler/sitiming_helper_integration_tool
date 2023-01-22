import { Race, Racer, Category } from 'interfaces/Database';
import SettingsAPI from './SettingsRepository';

const { Connection, Request: Req } = require('tedious');

const getConfig = () => {
  const serverSettings = SettingsAPI.getSettings();

  return {
    server: serverSettings.address,
    authentication: {
      type: 'default',
      options: {
        userName: serverSettings.username,
        password: serverSettings.password,
      },
    },
    options: {
      database: serverSettings.database,
      port: serverSettings.port,
      encrypt: false,
      trustServerCertificate: false,
      rowCollectionOnDone: true,
    },
  };
};

const connectToServer = (): Promise<typeof Connection> => {
  return new Promise((resolve, reject) => {
    const connection = new Connection(getConfig());
    connection.connect();

    connection.on('connect', (err: Error) => {
      if (err) {
        reject(err);
      } else {
        resolve(connection);
      }
    });
  });
};

const executeQuery = (connection: typeof Connection, sqlQuery: string) => {
  return new Promise((resolve, reject) => {
    let results: object[] = [];

    const request = new Req(sqlQuery, (err: Error) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
        connection.close();
      }
    });

    request.on(
      'doneInProc',
      (rowCount: number, more: boolean, rows: object[]) => {
        results = [];
        rows.forEach((row) => {
          const result = {};
          // @ts-ignore
          row.map(child => {
            // @ts-ignore
            result[child.metadata.colName] = child.value;
          });
          results.push(result);
        });
      }
    );

    connection.execSql(request);
  });
};

const getRacersByCategory = (category: string): Promise<Racer[]> => {
  return new Promise((resolve, reject) => {
    connectToServer()
      .then((connection) => {
        const query = `
          select e.ID as 'id', e.Name as 'name', e.Club as 'teamName', e.RaceNumber as 'bibNumber', c.Name as 'class' from Entry e
          join EntryEvent ee on ee.EntryID = e.ID
          join Class c on c.ID = ee.ClassID
          where c.Name = '${category}'
          order by e.Club asc
        `;

        return executeQuery(connection, query);
      })
      .then((racers: any) => {
        resolve(racers);
      })
      .catch((err) => reject(err));
  });
};

const getRacersByRaceId = (raceId: string): Promise<Racer[]> => {
  return new Promise((resolve, reject) => {
    connectToServer()
      .then((connection) => {
        const query = `
          select
            e.ID as 'id', e.Name as 'name', e.Club as 'teamName', e.RaceNumber as 'bibNumber',
            ee.ClassID as 'categoryId', ee.AllReturnedOrLostBroken as 'checkedIn',
            sc.CardNumber as 'cardNumber'
          from EntryEvent ee
          join Entry e on ee.EntryID = e.ID
          join SiCard sc on ee.ID = sc.EntryEventID
          where ee.EventID='${raceId}'
          order by e.RaceNumber asc
        `;

        return executeQuery(connection, query);
      })
      .then((racers: any) => {
        resolve(racers);
      })
      .catch((err) => reject(err));
  });
}

const getAllCategories = (raceId: string): Promise<Category[]> => {
  return new Promise((resolve, reject) => {
    connectToServer()
      .then((connection) => {
        const query = `
          select c.ID as 'id', c.Name as 'name', COUNT(e.ID) as 'numRacers'
          from Class c
          left join EntryEvent ee on c.ID = ee.ClassID
          left join Entry E on ee.EntryID = E.ID
          where c.EventID = '${raceId}'
          group by c.Name, c.ID
          order by c.Name
        `;

        return executeQuery(connection, query);
      })
      .then((categories: any) => {
        resolve(categories);
      })
      .catch((err) => reject(err));
  });
}

const getAllRaces = (): Promise<Race[]> => {
  return new Promise((resolve, reject) => {
    connectToServer()
      .then((connection) => {
        const query = `
          select e.ID as 'id', e.Name as 'name' from Event e
          order by e.Date desc
        `;

        return executeQuery(connection, query);
      })
      .then((races: any) => {
        resolve(races);
      })
      .catch((err) => reject(err));
  });
}

const SqlAPI = {
  getRacersByCategory,
  getRacersByRaceId,
  getAllCategories,
  getAllRaces,
};

export default SqlAPI;
