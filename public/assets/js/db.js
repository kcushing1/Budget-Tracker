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
  //get all transactions and POST bulk
  let db = request.result;
  const transaction = db.transaction(["budgetDB"], "readwrite");
  const transactionStore = transaction.objectStore("budgetDB");
  const getAll = transactionStore.getAll();

  getAll.onsuccess = () => {
    fetch("/api/transaction/bulk", {
      method: "POST",
      body: JSON.stringify(getAll.result),
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        response.json();
      })
      .then(() => {
        const transaction = db.transaction(["budgetDB"], "readwrite");
        const transactionStore = transaction.objectStore("budgetDB");
        transactionStore.clear();
      });
  };
}
