const { Connection, Request: Req } = require('tedious');

interface Racer {
  Name: string;
  'Team Name': string;
  'Bib Number': number;
  Class: string;
}

const config = {
  server: 'localhost',

  authentication: {
    type: 'default',
    options: {
      userName: 'sa',
      password: 'ABCDEFGH',
    },
  },

  options: {
    database: 'events4',
    encrypt: false,
    trustServerCertificate: false,
    rowCollectionOnDone: true,
  },
};

const connectToServer = (): Promise<typeof Connection> => {
  return new Promise((resolve, reject) => {
    const connection = new Connection(config);
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
          row.map(child => {
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
          select e.Name as 'Name', e.Club as 'Team Name', e.RaceNumber as 'Bib Number', c.Name as 'Class' from Entry e
          join EntryEvent ee on ee.EntryID = e.ID
          join Class c on c.ID = ee.ClassID
          where c.Name = '${category}'
          order by e.Club asc
        `;

        return executeQuery(connection, query);
      })
      .then((racers) => {
        resolve(racers);
      })
      .catch((err) => reject(err));
  });
};

const SqlAPI = {
  getRacersByCategory,
};

export default SqlAPI;
