///localStorage
/// JSON.parse
///JSON.stringify


// Book Class : Represent a Book

class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI Class : Handle UI tasks

class UI {
    static displayBook() {
        
        const books = Store.getBooks();

        books.forEach(function(book) {
            UI.addBookToList(book);
        });
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.isbn}</td>
          <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        setTimeout(function removeAlert() {
            document.querySelector('.alert').remove()
        }, 2000);
    }



    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// Store Class: Handles Storage
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}



// Event :Display Books 
document.addEventListener('DOMContentLoaded', UI.displayBook);

// Event : Add A Book

document.querySelector('#book-form').addEventListener('submit', function display(e) {
    e.preventDefault();

    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    if (title === '' || author === '' || isbn === '') {
        // Show Error Message
        UI.showAlert("Please Fill All The Fields!!", "danger");
    } else {
        const book = new Book(title, author, isbn);
        // Add book to UI
        UI.addBookToList(book);
        // Add book to store
        Store.addBook(book);
        // Show Success Message
        UI.showAlert("Book Added Successfully!!", "success");
        // clear field inputs
        UI.clearFields();
    }
});


document.querySelector('#book-list').addEventListener('click', function deleteItm(e) {
    // Remove book from UI
    UI.deleteBook(e.target);
    // Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    // Show remove message
    UI.showAlert("Book Removed!!", "warning");
})