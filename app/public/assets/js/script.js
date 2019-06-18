$(document).ready(function() {
	$('#add-btn').on('click', function(event) {
		event.preventDefault();
		var key = 'AIzaSyDB0TwWP5ouoFr37dmNo1r9HCRWzg3czsk';

		var title = $('#title')
			.val()
			.trim();
		var author = $('#author')
			.val()
			.trim();
		var isbn = $('#isbn')
			.val()
			.trim()
			.replace(/\D/g, '');
		console.log('title: ' + title + '\nauthor: ' + author + '\nISBN: ' + isbn);

		function searchBook() {
			var queryURL;

			if (isbn) {
				var queryURL = 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn + '&key=' + key;
			} else {
				if (!title) {
					var queryURL = 'https://www.googleapis.com/books/v1/volumes?q=inauthor:' + author + '&key=' + key;
				} else if (!author) {
					var queryURL = 'https://www.googleapis.com/books/v1/volumes?q=intitle:' + title + '&key=' + key;
				} else {
					var queryURL =
						'https://www.googleapis.com/books/v1/volumes?q=intitle:' +
						title +
						'+inauthor:' +
						author +
						'&key=' +
						key;
				}
			}
			queryURL = queryURL.replace(/ /g, '%20');
			console.log(queryURL);
			var bookObject = {};
			$.ajax({
				url: queryURL,
				method: 'GET',
			}).then(function(response) {
				// Printing the entire object to console
				console.log(response);

				// Empty the contents of the book-results div
				$('#book-results').empty();

				if (response.totalItems == 0) {
					var noBooks = $('<h4>').text('No books found!');
					$('#book-results').append(noBooks);
				} else {
					// Constructing HTML containing the book information
					for (let i = 0; i < response.items.length; i++) {
						var bookImage = $('<img class=title>').attr(
							'src',
							'https://books.google.com/books?id=' +
								response.items[i].id +
								'&printsec=frontcover&img=1&zoom=1&edge=nocurl&source=gbs_api'
						);
						var bookTitle = $('<h4 class=title>').text(response.items[i].volumeInfo.title);
						var bookAuthor = $('<h5 class=title>').text(response.items[i].volumeInfo.authors[0]);
						var bookGenre = $('<h5 class=title>').text(response.items[i].volumeInfo.categories[0]);
						var bookDescription = $('<p class=title>').text('Description: ' + response.items[i].volumeInfo.description);
						var date = new Date(response.items[i].volumeInfo.publishedDate);
						var bookYear = $('<p  class=title>').text('Published: ' + date.getFullYear());
						var bookPages = $('<p  class=title>').text(response.items[i].volumeInfo.pageCount + ' pages');
						var bookCondition = $("<select id='condition'>").html(
							"<option value='Like New' selected='selected'>Like New</option><option value='Good'>Good</option><option value='Fair'>Fair</option><option value='Poor'>Poor</option>"
						);
						var bookSelect = $("<button class='select-book'>")
							.attr('href', '')
							.text('Add this book');
						var lineBreak = $('</br>');
						bookObject = {
							title: response.items[i].volumeInfo.title,
							author: response.items[i].volumeInfo.authors[0],
							genre: response.items[i].volumeInfo.categories[0],
							description: response.items[i].volumeInfo.description,
							pubYear: response.items[i].volumeInfo.publishedDate,
							numPages: response.items[i].volumeInfo.pageCount, 
							imgurl: 'https://books.google.com/books?id=' + response.items[i].id + '&printsec=frontcover&img=1&zoom=1&edge=nocurl&source=gbs_api',
							email: $('#email').val()
						};
						var bookDiv =$('<div style="display:none" id="book'+[i]+'">'+ JSON.stringify(bookObject) +'</div>')
						// Append the new book content
						$('#book-results').append('<div class=\'newBook\'>');
						$('.newBook').append(
							lineBreak,
							bookImage,
							bookTitle,
							bookAuthor,
							bookGenre,
							bookDescription,
							bookYear,
							bookPages,
							bookCondition,
							bookSelect, 
							bookDiv
						);
					}
				}

				console.log(bookObject);
				// return bookObject;
			});
		}

		searchBook();
	});

	$('#clear').on('click', function(event) {
		$('#title').text('');
		$('#author').text('');
		$('#isbn').text('');
	});
});
