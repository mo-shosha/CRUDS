
const titleInput = document.querySelector('.title');
const priceInput = document.querySelector('.price');
const taxesInput = document.querySelector('.taxes');
const adsInput = document.querySelector('.ads');
const discountInput = document.querySelector('.discount');
const totalOutput = document.querySelector('.total');
const countInput = document.querySelector('.count');
const categoryInput = document.querySelector('.category');
const searchInput = document.querySelector('.search');
const TotalMain = document.querySelector('.TotalMain');

const createButton = document.querySelector('.btn-primary');
const searchByTitleButton = document.querySelectorAll('.btn-primary')[1];
const searchByCategoryButton = document.querySelectorAll('.btn-primary')[2];
const deleteAllButton = document.querySelectorAll('.btn-primary')[3];

const tableBody = document.querySelector('tbody');

let dataproduct = JSON.parse(localStorage.getItem('Products')) || [];

function GetTotal() {
    const price = parseFloat(priceInput.value) || 0;
    const taxes = parseFloat(taxesInput.value) || 0;
    const ads = parseFloat(adsInput.value) || 0;
    const discount = parseFloat(discountInput.value) || 0;
    const count = parseFloat(countInput.value) || 0;
    
    if (price !== 0) {
        const result = ((price + taxes + ads) - discount)*count;
        totalOutput.innerHTML = 'Total :' + Math.max(result.toFixed(2), 0);

        TotalMain.classList.remove('bg-warning');
        TotalMain.classList.add('bg-success');

        return result;
    } else {
        totalOutput.innerHTML = 'Total :';

        TotalMain.classList.remove('bg-success');
        TotalMain.classList.add('bg-warning');

        return 0;
    }
}

function updateLocalStorage() {
    localStorage.setItem('Products', JSON.stringify(dataproduct));
}

function updateDeleteAllButtonLabel() {
    deleteAllButton.innerHTML = `Delete All (${dataproduct.length})`;
}

function renderTable(products) {
    tableBody.innerHTML = '';

    (products || dataproduct).forEach((product, index) => {
        if (product.title != '') {
            const newRow = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${product.title}</td>
                    <td>${product.price}</td>
                    <td>${product.taxes}</td>
                    <td>${product.ads}</td>
                    <td>${product.discount}</td>
                    <td>${product.total.toFixed(2)}</td>
                    <td>${product.category}</td>
                    <td><button onclick='update(${index})' class="btn btn-warning Update">Update</button></td>
                    <td><button onclick='delet(${index})' class="btn btn-danger Delete">Delete</button></td>
                </tr>
            `;
            tableBody.innerHTML += newRow;
        }
    });

    updateDeleteAllButtonLabel();
}

window.onload = function () {
    renderTable();
};


deleteAllButton.addEventListener('click', function () {
    localStorage.clear();
    dataproduct = [];
    renderTable();
});

searchByTitleButton.addEventListener('click', function () {
    const query = searchInput.value.toLowerCase();
    const filteredProducts = dataproduct.filter(product =>
        product.title.toLowerCase().includes(query)
    );
    renderTable(filteredProducts);
});

searchByCategoryButton.addEventListener('click', function () {
    const query = searchInput.value.toLowerCase();
    const filteredProducts = dataproduct.filter(product =>
        product.category.toLowerCase().includes(query)
    );
    renderTable(filteredProducts);
});

function update(i) {
    const product = dataproduct[i];
    
    titleInput.value = product.title;
    priceInput.value = product.price;
    taxesInput.value = product.taxes;
    adsInput.value = product.ads;
    discountInput.value = product.discount;
    countInput.value = product.count;
    categoryInput.value = product.category;

    createButton.textContent = 'Update Product';
    createButton.onclick = function () {
        product.title = titleInput.value;
        product.price = parseFloat(priceInput.value) || 0;
        product.taxes = parseFloat(taxesInput.value) || 0;
        product.ads = parseFloat(adsInput.value) || 0;
        product.discount = parseFloat(discountInput.value) || 0;
        product.total = GetTotal();
        product.category = categoryInput.value;

        dataproduct[i] = product;

        updateLocalStorage();

        renderTable();

        titleInput.value = '';
        priceInput.value = '';
        taxesInput.value = '';
        adsInput.value = '';
        discountInput.value = '';
        countInput.value = '';
        categoryInput.value = '';
        totalOutput.innerHTML = 'Total :';

        createButton.textContent = 'Add Product';
        createButton.onclick = addProduct;
    };
}

function delet(i) {
    dataproduct.splice(i, 1);

    updateLocalStorage();

    renderTable();
}

function addProduct() {
    const Title = titleInput.value;
    const Price = parseFloat(priceInput.value) || 0;
    const Taxes = parseFloat(taxesInput.value) || 0;
    const Ads = parseFloat(adsInput.value) || 0;
    const Discount = parseFloat(discountInput.value) || 0;
    const Count = parseFloat(countInput.value) || 0;
    const Total = GetTotal();
    const Category = categoryInput.value;

    if (!Title || !Price || !Category) {
        alert("Please fill out all required fields (Title, Price, Category)");
        return;
    }

    let newpro = {
        title: Title,
        price: Price,
        taxes: Taxes,
        ads: Ads,
        discount: Discount,
        total: Total,
        category: Category,
        count: Count
    };

    dataproduct.push(newpro);

    updateLocalStorage();

    renderTable();

    titleInput.value = '';
    priceInput.value = '';
    taxesInput.value = '';
    adsInput.value = '';
    discountInput.value = '';
    countInput.value = '';
    categoryInput.value = '';
}

createButton.onclick = addProduct;
