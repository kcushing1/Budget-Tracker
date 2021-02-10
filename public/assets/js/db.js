//create indexedDB
//stores the offline user input
//when return online, sends to mongoDB

const request = indexedDB.open("budgetDB", 1);

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  const objStore = db.createObjectStore("budgetDB");
  objStore.createIndex("transaction", "transaction");
};

request.onsuccess = (event) => {
  console.log(request.result);
  console.log("created indexedDB budgetDB...I think");
};
