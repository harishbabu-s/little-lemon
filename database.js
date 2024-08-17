import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("little_lemon");

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          "create table if not exists menuitems (id integer primary key not null, name text, price text, description text, image text, category text);"
        );
      },
      reject,
      resolve
    );
  });
}

export async function getMenuItems() {
  return new Promise(resolve => {
    db.transaction(tx => {
      tx.executeSql("select * from menuitems", [], (_, { rows }) => {
        const menu = rows._array;
        resolve(menu);
      });
    });
  });
}

export function saveMenuItems(menuItems) {
  db.transaction(tx => {
    tx.executeSql(
      `insert into menuitems (id, name, price, description, image, category) values ${menuItems
        .map(
          item =>
            `("${item.id}", "${item.name}", "${item.price}", "${item.description}", "${item.image}", "${item.category}")`
        )
        .join(", ")}`
    );
  });
}

export async function filterByQueryAndCategories(query, activeCategories) {
   return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from menu where category in (${activeCategories
          .map((category) => `'${category}'`)
          .join(", ")}) and name like '%${query}%'`,
        [],
        (_, { rows }) => {
          resolve(rows._array);
        },
        reject
      );
    });
  });
}
