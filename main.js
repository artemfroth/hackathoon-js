const api = "http://localhost:8001/students";
let addBtn = document.querySelector(".btn-add");
addBtn.addEventListener("click", () => {
  myModal.style.display = "flex";
});

let myModal = document.querySelector(".my-modal");
let closeModal = document.querySelector(".close-modal");
closeModal.addEventListener("click", () => {
  myModal.style.display = "none";
});

let inp1 = document.querySelector(".inp1");
let inp2 = document.querySelector(".inp2");
let inp3 = document.querySelector(".inp3");
let inp4 = document.querySelector(".inp4");
let inp5 = document.querySelector(".inp5");
let btnSave = document.querySelector(".btn-save");
let ul = document.querySelector(".list-group");
btnSave.addEventListener("click", () => {
  const newStudent = {
    lastName: inp1.value,
    firstName: inp2.value,
    phone: inp3.value,
    weekKPI: inp4.value,
    monthKPI: inp5.value,
  };
  let checkResult = checkInputs(newStudent);
  if (checkResult) {
    showAlert("Заполните поля!", "red", "white");
    return;
  }

  fetch(api, {
    method: "POST",
    body: JSON.stringify(newStudent),
    headers: {
      "Content-type": "application/json",
    },
  }).then(() => {
    inp1.value = "";
    inp2.value = "";
    inp3.value = "";
    inp4.value = "";
    inp5.value = "";
    myModal.style.display = "none";
  });
});
function checkInputs(obj) {
  for (let i in obj) {
    if (!obj[i].trim()) {
      return true;
    }
  }
  return false;
}

let editModal = document.querySelector(".edit-modal");
let editInp1 = document.querySelector(".edit-inp1");
let editInp2 = document.querySelector(".edit-inp2");
let editInp3 = document.querySelector(".edit-inp3");
let editInp4 = document.querySelector(".edit-inp4");
let editInp5 = document.querySelector(".edit-inp5");
let editBtnSave = document.querySelector(".edit-btn-save");

const getStudents = () => {
  fetch(`${api}`)
    .then((res) => {
      return res.json();
    })
    .then((students) => {
      ul.innerHTML = "";
      students.forEach((item) => {
        const li = document.createElement("li");
        const div = document.createElement("div");
        const editImg = document.createElement("img");
        const deleteImg = document.createElement("img");
        editImg.setAttribute("src", "./imgs/edit.png");
        deleteImg.setAttribute("src", "./imgs/delete.png");
        li.classList.add("list-group-item");
        li.innerHTML = `
        <span>
        ${item.lastName}
        ${item.firstName}
        <a href="tel:${item.phone}">${item.phone}<a/>
        ${item.weekKPI}
        ${item.monthKPI}
        </span>
        `;
        div.append(editImg, deleteImg);
        li.append(div);
        ul.append(li);

        deleteImg.addEventListener("click", () => {
          fetch(`${api}/${item.id}`, {
            method: "DELETE",
          }).then(() => {
            getStudents();
            showAlert("Успешно удалено!", "green", "white");
          });
        });

        editImg.addEventListener("click", () => {
          editModal.style.display = "flex";
          editInp1.value = item.firstName;
          editInp2.value = item.lastName;
          editInp3.value = item.phone;
          editInp4.value = item.weekKPI;
          editInp5.value = item.monthKPI;
          editBtnSave.setAttribute("id", item.id);
        });
      });
    });
};
getStudents();

let editCloseModal = document.querySelector(".edit-close-modal");
editCloseModal.addEventListener("click", () => {
  editModal.style.display = "none";
});

editBtnSave.addEventListener("click", (event) => {
  const editedStudents = {
    lastName: editInp2.value,
    firstName: editInp1.value,
    phone: editInp3.value,
    weekKPI: editInp4.value,
    monthKPI: editInp5.value,
  };
  fetch(`${api}/${event.target.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editedStudents),
  }).then(() => {
    editModal.style.display = "none";
    getStudents();
  });
});

function showAlert(text, bgcolor, color) {
  Toastify({
    text: text,
    duration: 3000,
    close: true,
    gravity: "bottom", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: bgcolor,
      color: color,
    },
  }).showToast();
}
