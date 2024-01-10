let data = [];
async function getData() {
  const api = "http://localhost:5678/api/works";
  try {
    const response = await fetch(api);
    data = await response.json();
    console.log(data);

    generProjets();
    displaygalerieModal();
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des données :",
      error
    );
  }
}
getData();
function generProjets() {
  //effacer le contenue de la balise body
  document.querySelector(".gallery").innerHTML = "";

  // Génère les projets

  for (let i = 0; i < data.length; i++) {
    const figure = document.createElement("figure");
    const sectionProjets = document.querySelector(".gallery");
    // figure.classList.add(`js-projet-${data[i].id}`); // Ajoute l'id du projet pour le lien vers la modale lors de la supression
    const img = document.createElement("img");
    img.src = data[i].imageUrl;
    img.alt = data[i].title;
    figure.appendChild(img);

    const figcaption = document.createElement("figcaption");
    figcaption.innerHTML = data[i].title;
    figure.appendChild(figcaption);
    sectionProjets.appendChild(figure);
  }
}
// Affichage des filtres
async function getcategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();
  console.log(categories);
  const btnTous = document.querySelector(".filters button");
  btnTous.addEventListener("click", (e) => {
    generProjets(data);
  });
  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.id = category.id;
    const filters = document.querySelector(".filters");
    filters.appendChild(btn);
    //filtrage au click sur le bouton par categories
    btn.addEventListener("click", (e) => {
      const filterdata = data.filter((d) => d.category.id === category.id);
      generProjets(filterdata);
    });
  });
}
getcategories();

//Afficher la Modal
const token = sessionStorage.getItem("token");
const loginButton = document.getElementById("loginButton");
const containerModal = document.querySelector(".containerModal");
const xmark = document.querySelector(".containerModal .fa-xmark");
const logoutButton = document.getElementById("logoutButton");
const buttonModifier = document.querySelector(".admin__modifer");
/******  Vérifier si l'utilisateur est connecté *******/
if (token) {
  loginButton.textContent = "logout";
  buttonModifier.addEventListener("click", () => {
    containerModal.style.display = "flex";
  });
  xmark.addEventListener("click", () => {
    containerModal.style.display = "none";
  });
  containerModal.addEventListener("click", (e) => {
    if (e.target.className === "containerModal") {
      containerModal.style.display = "none";
    }
  });
} else {
  loginButton.innerHTML = '<a href="login.html">login</a>';
}

//Affichage des travaux dans la modal
const galerieModal = document.querySelector(".galerieModal");

function displaygalerieModal() {
  galerieModal.innerHTML = "";
  console.log(data);
  for (let i = 0; i < data.length; i++) {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const span = document.createElement("span");
    const trash = document.createElement("i");
    trash.classList.add("fa-solid", "fa-trash-can");
    trash.id = data[i].id;
    trash.addEventListener("click", async function () {
      const response = await fetch(
        "http://localhost:5678/api/works/" + data[i].id,
        {
          method: "delete",
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        }
      );
      if (response.ok) {
        data = data.filter((d) => d.id !== data[i].id);
        generProjets();
        displaygalerieModal();
      }
    });
    img.src = data[i].imageUrl;
    span.appendChild(trash);
    figure.appendChild(img);
    figure.appendChild(span);

    galerieModal.appendChild(figure);
  }
}
const modalButton = document.getElementById("modalbutton");
const addWorkModal = document.querySelector(".addWorkModal");

// Fonction pour ouvrir la modal d'ajout de travaux
function openAddWorkModal() {
  console.log("Clic sur le bouton Ajouter une photo");
  addWorkModal.style.display = "flex";
}

// Fonction pour fermer la modal d'ajout de travaux
function closeAddWorkModal() {
  const addWorkModal = document.querySelector(".addWorkModal");
  addWorkModal.style.display = "none";
}
modalButton.addEventListener("click", openAddWorkModal);

// Ajouter l'écouteur d'événement sur le bouton modal
modalButton.addEventListener("click", openAddWorkModal);

// Écouter le clic sur le bouton pour ouvrir la modal
const addWorkButton = document.getElementById("addWorkButton");
addWorkButton.addEventListener("click", openAddWorkModal);

// Écouter le clic sur le bouton de fermeture de la modal
const closeModalButton = document.querySelector(".addWorkModal .closeModal");
closeModalButton.addEventListener("click", closeAddWorkModal);

// Écouter la soumission du formulaire pour ajouter un travail
const addWorkForm = document.getElementById("addWorkForm");
addWorkForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Récupérer les valeurs du formulaire
  const workTitle = document.getElementById("workTitle").value;
  const workImage = document.getElementById("workImage").value;
  const workCategory = document.getElementById("workCategory").value;

  // Faire quelque chose avec les valeurs (par exemple, envoyer au serveur)

  // Fermer la modal d'ajout de travaux
  closeAddWorkModal();
});
