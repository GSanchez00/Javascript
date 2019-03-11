console.log('hola mundo!');
const noCambia = "Sanchez";

let cambia = "@SanchezGustavo"

function cambiarNombre(nuevoNombre) {
  cambia = nuevoNombre
}


//Una promesa es un objeto que representa la terminacion o el fracaso eventual de una operacion asincrona. O sea mandar una funcion y ver si esta falla o no. 
//new Promise() crea una promesa. y se puede guardar dentro de una variable o constante. 
//la promesa recibe un argumento que es una funcion. Y esa funcion va a recibir 2 parametros
// new Promise(function(todoBien, todoMal){})

const getUserAll = new Promise(function(todoBien, todoMal) {
  // llamar a un api
  setTimeout(function() {
    // luego de 5 segundos
    todoBien('termino la funcion 5');
  }, 5000)
})

const getUser = new Promise(function(todoBien, todoMal) {
  // llamar a un api
  setTimeout(function() {
    // luego de 3 segundos
    todoBien('termino la funcion 3');
  }, 3000)
})

//Si todo salio bien va a venir por then, sino pasa por catch. Una promesa puede ser instantanea o mas demorada. 
// getUser
//   .then(function() {
//     console.log('todo está bien en la vida')
//   })
//   .catch(function(message) {
//     console.log(message)
//   })

//Una Promise  que se cumplirá cuando todas las promesas del argumento iterable hayan sido cumplidas, o bien se rechazará cuando alguna de ellas se rechace.
//Si falla una te dice cual fallo y porque. Si no falla ninguna, te devuelve todos los mensajes o respuestas de cada promesa. 
Promise.all([
  getUser,
  getUserAll,
])
.then(function(message) {
  console.log(message + " Exito");
})
.catch(function(message) {
  console.log(message + " Fracaso")
})


//El método Promise.race(iterable) retorna una promesa que se cumplirá o no tan pronto como una de las promesas del argumento iterable se cumpla o se rechace, con el valor o razón de rechazo de ésta.
//O sea que devuelve la primer promesa que se ejecuta, no importa si se cumplio o si tuvo un error. Devuelve la primera, ya sea por then o catch
// Promise.race([
//   getUser,
//   getUserAll,
// ])
// .then(function(message) {
//   console.log(message + " Exito");
// })
// .catch(function(message) {
//   console.log(message + " Fracaso")
// })


//Desde jquery
$.ajax('https://randomuser.me/api/', {
  method: 'GET',
  success: function(data) {
    console.log("Desde jquery " + data)
  },
  error: function(error) {
    console.log("Desde jquery " + error)
  }
})

//Desde vanilla
fetch('https://randomuser.me/api/') //Por default usa get
  .then(function (response) {
    //console.log(response)
    return response.json()
  })
  .then(function (user) {
    console.log("Desde vanilla " + 'user', user.results[0].name.first)
  })
  .catch(function() {
    console.log('Desde vanilla algo falló')
  });

// Creamos una funcion asincrona
//await lo que hace es que esperemos a la api
//la funcion load se autoejecuta al iniciar la aplicacion
(async function load() {
  // await
  // action
  // terror
  // animation
  async function getData(url) {
    const response = await fetch(url);
    const data = await response.json();
    if (data.data.movie_count > 0) {
      // aquí se acaba
      return data;
    }
    // si no hay pelis aquí continua
    throw new Error('No se encontró ningun resultado');
  }

  async function getFriendData(url) {
    const response = await fetch(url);
    const data = await response.json();
    if (data.info.results > 0) {
      return data;
    }
    // si no hay pelis aquí continua
    throw new Error('No se encontró ningun resultado');
  }

  const $form = document.getElementById('form');
  const $home = document.getElementById('home');
  const $featuringContainer = document.getElementById('featuring');


  function setAttributes($element, attributes) {
    for (const attribute in attributes) {
      $element.setAttribute(attribute, attributes[attribute]);
    }
  }
  const BASE_API = 'https://yts.am/api/v2/';



  ///Al hacer clic en el text de buscar, busca la pelicula y te muestra en rojo, pelicula encontrada y te muestra la imagen. 
  $form.addEventListener('submit', async (event) => {
    event.preventDefault();
    $home.classList.add('search-active')
    const $loader = document.createElement('img');
    setAttributes($loader, {
      src: 'src/images/loader.gif',
      height: 50,
      width: 50,
    })
    $featuringContainer.append($loader);

    const data = new FormData($form);
    //la estructura del json arranca con data luego movies y el valor de movies lo mete en pelis. 
    try {
      const {
        data: {
          movies: pelis
        }
      } = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`)

      const HTMLString = featuringTemplate(pelis[0]);
      $featuringContainer.innerHTML = HTMLString;
    } catch(error) {
      alert(error.message);
      $loader.remove();
      $home.classList.remove('search-active');
    }
  })

  //Crea el codigo de html que muestra la pelicula encontrada.
  function featuringTemplate(peli) {
    return (
      `
      <div class="featuring">
        <div class="featuring-image">
          <img src="${peli.medium_cover_image}" width="70" height="100" alt="">
        </div>
        <div class="featuring-content">
          <p class="featuring-title">Pelicula encontrada</p>
          <p class="featuring-album">${peli.title}</p>
        </div>
      </div>
      `
    )
  }

  function friendTemplate(friend)
  {
    return (
      `
      <li class="playlistFriends-item">
      <a href="#">
        <img src="${friend.picture.thumbnail}" alt="" />
        <span>
          ${friend.name.first} ${friend.name.last}
        </span>
      </a>
      </li>
    `)
  }

  //Creación de templates
  function videoItemTemplate(movie, category) {
    return (
      `<div class="primaryPlaylistItem" data-id="${movie.id}" data-category=${category}>
        <div class="primaryPlaylistItem-image">
          <img src="${movie.medium_cover_image}">
        </div>
        <h4 class="primaryPlaylistItem-title">
          ${movie.title}
        </h4>
      </div>`
    )
  }
  function createTemplate(HTMLString) {
    const html = document.implementation.createHTMLDocument();
    html.body.innerHTML = HTMLString;
    return html.body.children[0];
  }
  function addEventClick($element) {
    $element.addEventListener('click', () => {
      showModal($element)
    })
  }
  function renderMovieList(list, $container, category) {
    $container.children[0].remove(); //Remueve el gif de loading
    list.forEach((movie) => {
      const HTMLString = videoItemTemplate(movie, category);
      const movieElement = createTemplate(HTMLString);
      $container.append(movieElement);
      const image = movieElement.querySelector('img');
      image.addEventListener('load', (event) => {
        event.srcElement.classList.add('fadeIn');
      })
      addEventClick(movieElement);
    })
  }

  function renderFriend(friend, $friendContainer)
  {
    const HTMLString=friendTemplate(friend);
    const friendElement = createTemplate(HTMLString);
    $friendContainer.append(friendElement);
  }

  async function cacheExist(category) {
    const listName = `${category}List`;
    const cacheList = window.localStorage.getItem(listName);

    if (cacheList) {
      return JSON.parse(cacheList);
    }

    const { data: { movies: data } } = await getData(`${BASE_API}list_movies.json?genre=${category}`)
    window.localStorage.setItem(listName, JSON.stringify(data))

    return data;
  }

  // const { data: { movies: actionList} } = await getData(`${BASE_API}list_movies.json?genre=action`)
  const actionList = await cacheExist('action');
  // window.localStorage.setItem('actionList', JSON.stringify(actionList))
  const $actionContainer = document.querySelector('#action');
  renderMovieList(actionList, $actionContainer, 'action');

  const dramaList = await await cacheExist('drama');
  const $dramaContainer = document.getElementById('drama');
  renderMovieList(dramaList, $dramaContainer, 'drama');

  const animationList = await await cacheExist('animation');
  const $animationContainer = document.getElementById('animation');
  renderMovieList(animationList, $animationContainer, 'animation');

  const $friendContainer = document.querySelector('.playlistFriends');
  for(let i=0; i<8;i++)
  {
    const { results: persona } = await getFriendData("https://randomuser.me/api/")
    renderFriend(persona[0], $friendContainer);
  }






  // const $home = $('.home .list #item');
  const $modal = document.getElementById('modal');
  const $overlay = document.getElementById('overlay');
  const $hideModal = document.getElementById('hide-modal');

  const $modalTitle = $modal.querySelector('h1');
  const $modalImage = $modal.querySelector('img');
  const $modalDescription = $modal.querySelector('p');

  function findById(list, id) {
    return list.find(movie => movie.id === parseInt(id, 10))
  }

  function findMovie(id, category) {
    switch (category) {
      case 'action' : {
        return findById(actionList, id)
      }
      case 'drama' : {
        return findById(dramaList, id)
      }
      default: {
        return findById(animationList, id)
      }
    }
  }

  function showModal($element) {
    $overlay.classList.add('active');
    $modal.style.animation = 'modalIn .8s forwards';
    const id = $element.dataset.id;
    const category = $element.dataset.category;
    const data = findMovie(id, category);

    $modalTitle.textContent = data.title;
    $modalImage.setAttribute('src', data.medium_cover_image);
    $modalDescription.textContent = data.description_full
  }

  $hideModal.addEventListener('click', hideModal);
  function hideModal() {
    $overlay.classList.remove('active');
    $modal.style.animation = 'modalOut .8s forwards';

  }




})()
