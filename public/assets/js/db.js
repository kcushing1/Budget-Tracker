//create listener for being online/offline
window.addEventListener("online", checkDB);
online = window.navigator.online;

let db;

const request = indexedDB.open("budgetDB", 1);

request.onupgradeneeded = (event) => {
  let db = event.target.result;

  //create new object store called "budgetDB"
  db.createObjectStore("budgetDB", { autoIncrement: true });
};

request.onsuccess = () => {
  let db = request.result;
  const transaction = db.transaction(["budgetDB"], "readwrite");
  const transactionStore = transaction.objectStore("budgetDB");

  if (navigator.online) {
    console.log("checking if online");
    checkDB();
  }
};

function saveRecord(offlineTransaction) {
  console.log(offlineTransaction);
  let db = request.result;
  const transaction = db.transaction(["budgetDB"], "readwrite");
  const transactionStore = transaction.objectStore("budgetDB");
  transactionStore.add(offlineTransaction);
}

function checkDB() {
  console.log("inside checkDB");
  //get all transactions and POST bulk
  let db = request.result;
  const transaction = db.transaction(["budgetDB"], "readwrite");
  const transactionStore = transaction.objectStore("budgetDB");
  const getAll = transactionStore.getAll();

  getAll.onsuccess = () => {
    console.log(getAll.result, "get all results");
    fetch("/api/transaction/bulk", {
      method: "POST",
      body: JSON.stringify(getAll.result),
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log("getAll .then");
        response.json();
      })
      .then(() => {
        console.log(".getAll clear step");
        const transaction = db.transaction(["budgetDB"], "readwrite");
        const transactionStore = transaction.objectStore("budgetDB");
        transactionStore.clear();
      });
  };
}
