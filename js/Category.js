export default class Category {

    constructor() {
        this.categories = [];
        this.containerHome = document.getElementById('categories');
        this.containerProducts = document.getElementById('nav-categories');
    }

    //Get the categories from DB
    async getCategories() {
        const URI = '../db/categories.json';
        const response = await fetch(URI);

        const data = await response.json();
        return data.categories;
    }

    //Show the categories at Index page as banner with image
    render(listCategories) {
        for (const category of listCategories) {
            const divCategory = document.createElement('div');
            divCategory.classList.add('category');
            divCategory.setAttribute('id', category.id);
            

            const image = document.createElement('img');
            image.src = category.image;
            image.setAttribute('alt', category.name);
            image.classList.add('category-image');
            divCategory.append(image);

            const title = document.createElement('span');
            title.classList.add('category-text');
            title.innerText = category.name;
            divCategory.append(title);

            this.containerHome.append(divCategory);
        }
    }

    //Show the categories at products page
    showList(listCategories) {
        for (const category of listCategories) {
            const link = document.createElement('a');
            link.classList.add('nav-categories-link');
            link.href = `/products.html?categoryId=${category.id}`
            link.innerText = category.name;
            link.setAttribute('id', category.id)

            this.containerProducts.append(link);
        }
    }

    //Change the color to active Category
    setActive(categoryId) {
        const categoryActive = document.getElementById(categoryId);
        if (categoryActive) {
            categoryActive.classList.add('nav-category-active')
        }
    }

}