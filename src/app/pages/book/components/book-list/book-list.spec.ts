import { ComponentFixture, TestBed } from "@angular/core/testing";
import BookList from "./book-list";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { BookService } from "../../services/book-service";
import { Book } from "../../interfaces/book.interface";

describe('BookList Component', () => {
    let component: BookList;
    let fixture: ComponentFixture<BookList>;
    let bookService: jasmine.SpyObj<BookService>;
    let router: jasmine.SpyObj<Router>;

    const mockBooks: Book[] = [
        { id: 1, title: "Cien años de soledad", author: "Gabriel García Márquez", pages: 417, available: true },
        { id: 2, title: "1984", author: "George Orwell", pages: 328, available: false }
    ];

  beforeEach(async () => {
    const bookServiceSpy = jasmine.createSpyObj('BookService', ['getBooks', 'deleteBook']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
        imports: [BookList],
        providers: [
            { provide: BookService, useValue: bookServiceSpy },
            { provide: Router, useValue: routerSpy }
        ]
        }).compileComponents();

        bookService = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

        bookService.getBooks.and.returnValue(of(mockBooks));

        fixture = TestBed.createComponent(BookList);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should load books on initialization', (done) => {
        fixture.detectChanges();

        component.books$.subscribe(books => {
            expect(books).toEqual(mockBooks);
            expect(bookService.getBooks).toHaveBeenCalledTimes(1);
            done();
        });
    });

    it('should navigate to create book page when onAddBook is called', () => {
        component.onAddBook();
        expect(router.navigate).toHaveBeenCalledWith(['/books/create-book']);
    });

    it('should navigate to edit book page with correct id when onEditBook is called', () => {
        const bookId = 3;
        component.onEditBook(bookId);
        expect(router.navigate).toHaveBeenCalledWith(['/books', bookId]);
    });

    it('should not delete book when confirmation is cancelled', () => {
        spyOn(window, 'confirm').and.returnValue(false);
        component.onDeleteBook(1);
        expect(bookService.deleteBook).not.toHaveBeenCalled();
    });

    it('should handle empty book list', (done) => {
        bookService.getBooks.and.returnValue(of([]));
        fixture.detectChanges();

        component.books$.subscribe(books => {
            expect(books.length).toBe(0);
            done();
        });
    });

    it('should display "Disponible" or "No disponible" correctly', () => {
        expect(component.displayAvailability(true)).toBe('Disponible');
        expect(component.displayAvailability(false)).toBe('No disponible');
    });

    it('should set isDeleting correctly when deleting a book', (done) => {
        spyOn(window, 'confirm').and.returnValue(true);

        bookService.deleteBook.and.returnValue(of(void 0));
        bookService.getBooks.and.returnValue(of(mockBooks));

        component.onDeleteBook(2);
        
        expect(component.isDeleting()).toBe(2);

        setTimeout(() => {
            expect(component.isDeleting()).toBeNull();
            done();
        }, 0);
    });

});