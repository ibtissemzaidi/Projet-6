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
  const banner = document.querySelector(".banner");
  banner.innerHTML =
    '<i class="fa-solid fa-pen-to-square" style="color: white;"></i>' +
    "<h2>Mode édition</h2>";
  banner.classList.add("visibleBanner");
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
  banner.classList.add("invisibleBanner");
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
const btnAjouterProjet = document.getElementById("modalbutton");
btnAjouterProjet.addEventListener("click", () => {
  const addWorkModal = document.querySelector(".addWorkModal");
  addWorkModal.style.display = "flex";
});

// Fonction pour ouvrir la modal d'ajout de travaux
async function addWork() {
  const title = document.querySelector(".js-title").value;
  const categoryId = document.querySelector(".js-categoryId").value;
  const image = document.querySelector(".js-image").files[0];

  if (title === "" || categoryId === "" || image === undefined) {
    alert("Merci de remplir tous les champs");
    return;
  } else if (categoryId !== "1" && categoryId !== "2" && categoryId !== "3") {
    alert("Merci de choisir une catégorie valide");
    return;
  } else {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", categoryId);
      formData.append("image", image);

      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.status === 201) {
        alert("Projet ajouté avec succès :)");
        generProjets();
        displaygalerieModal();
      } else if (response.status === 400) {
        alert("Merci de remplir tous les champs");
      } else if (response.status === 500) {
        alert("Erreur serveur");
      } else if (response.status === 401) {
        alert("Vous n'êtes pas autorisé à ajouter un projet");
        window.location.href = "login.html";
      }
    } catch (error) {
      console.log(error);
    }
  }

  const btnAjouterProjet = document.getElementById("modalbutton");
  btnAjouterProjet.addEventListener("click", () => {
    const addWorkModal = document.querySelector(".addWorkModal");
    galerieModal.style.display = "none";
    addWorkModal.style.display = "flex";
  });
}
