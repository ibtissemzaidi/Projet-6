const submit = document.getElementById("submit");
const form = document.querySelector(".login__form");
form.addEventListener("submit", function () {
  const email = document.getElementById("email").value;
  const motDePasse = document.getElementById("password").value;
  // Données à envoyer dans la requête POST
  const donnees = {
    email: email,
    password: motDePasse,
  };

  // Effectuer la requête POST à l'aide de fetch
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(donnees),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        alert("Mot de passe ou nom d'utlisateur est incorret");
      }
    })
    .then((userInfo) => {
      const token = userInfo.token;
      console.log("token");
      sessionStorage.setItem("token", token);
      window.location.href = "index.html";
    })
    .catch((erreur) => {
      console.error("Erreur :", erreur);
    });
});
