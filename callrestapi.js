const urlBase = "https://postgres-api-videojuegos.onrender.com/api/videojuegos"; // Cambia esto a /api/videogames si ya lo renombraste

// Crear nuevo videojuego
function postVideogame() {
  const videogame = {
    title: $('#title').val(),
    genre: $('#genre').val(),
    platform: $('#platform').val(),
    releaseYear: $('#releaseYear').val(),
    developer: $('#developer').val(),
    coverImage: $('#coverImage').val(),
    description: $('#description').val()
  };

  $.ajax({
    url: urlBase,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(videogame),
    success: function () {
      alert('Videojuego agregado correctamente.');
      $('input, textarea').val('');
      $('#updateArea').html('');
      getVideogames();
    },
    error: function (err) {
      alert('Error al agregar el videojuego.');
      console.error(err);
    }
  });
}

// Obtener todos los videojuegos
function getVideogames() {
  $.ajax({
    url: urlBase,
    type: 'GET',
    success: function (data) {
      const games = data.videogames || data.users || data;

      let html = '<table>';
      html += `
        <tr>
          <th>Título</th>
          <th>Género</th>
          <th>Plataforma</th>
          <th>Año</th>
          <th>Desarrollador</th>
          <th>Imagen</th>
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>`;

      for (let i = 0; i < games.length; i++) {
        const game = games[i];

        html += `
          <tr>
            <td>${escapeHtml(game.title)}</td>
            <td>${escapeHtml(game.genre)}</td>
            <td>${escapeHtml(game.platform)}</td>
            <td>${game.releaseYear}</td>
            <td>${escapeHtml(game.developer)}</td>
            <td><img src="${escapeHtml(game.coverImage)}" alt="Imagen" width="60"></td>
            <td>${escapeHtml(game.description || '')}</td>
            <td>
              <button class="edit-btn"
                data-id="${game.id}"
                data-title="${escapeHtml(game.title)}"
                data-genre="${escapeHtml(game.genre)}"
                data-platform="${escapeHtml(game.platform)}"
                data-releaseyear="${game.releaseYear}"
                data-developer="${escapeHtml(game.developer)}"
                data-coverimage="${escapeHtml(game.coverImage)}"
                data-description="${escapeHtml(game.description || '')}"
                onclick="handleEditButtonClick(this)">✏️</button>
              <button onclick="deleteVideogame(${game.id})" class="delete-btn">🗑️</button>
            </td>
          </tr>`;
      }

      html += '</table>';
      $('#resultado').html(html);
    },
    error: function (err) {
      $('#resultado').html('<p>Error al obtener videojuegos.</p>');
      console.error(err);
    }
  });
}

// Escapar HTML para evitar XSS
function escapeHtml(text) {
  return $('<div>').text(text).html();
}

// Llenar formulario con datos del videojuego
function handleEditButtonClick(btn) {
  const $btn = $(btn);
  fillForm(
    $btn.data('id'),
    $btn.data('title'),
    $btn.data('genre'),
    $btn.data('platform'),
    $btn.data('releaseyear'),
    $btn.data('developer'),
    $btn.data('coverimage'),
    $btn.data('description')
  );
}

function fillForm(id, title, genre, platform, releaseYear, developer, coverImage, description) {
  $('#title').val(title);
  $('#genre').val(genre);
  $('#platform').val(platform);
  $('#releaseYear').val(releaseYear);
  $('#developer').val(developer);
  $('#coverImage').val(coverImage);
  $('#description').val(description);

  $('#updateArea').html('<button id="updateVideogameBtn" class="post-btn" onclick="updateVideogame(' + id + ')">Actualizar</button>');
}

// Actualizar videojuego
function updateVideogame(id) {
  const videogame = {
    title: $('#title').val(),
    genre: $('#genre').val(),
    platform: $('#platform').val(),
    releaseYear: $('#releaseYear').val(),
    developer: $('#developer').val(),
    coverImage: $('#coverImage').val(),
    description: $('#description').val()
  };

  $.ajax({
    url: `${urlBase}/${id}`,
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify(videogame),
    success: function () {
      alert('Videojuego actualizado correctamente.');
      $('input, textarea').val('');
      $('#updateArea').html('');
      getVideogames();
    },
    error: function (err) {
      alert('Error al actualizar el videojuego.');
      console.error(err);
    }
  });
}

// Eliminar videojuego sin confirmación
function deleteVideogame(id) {
  $.ajax({
    url: `${urlBase}/${id}`,
    type: 'DELETE',
    success: function () {
      getVideogames(); // Actualizar lista
    },
    error: function (err) {
      alert('Error al eliminar el videojuego.');
      console.error(err);
    }
  });
}
