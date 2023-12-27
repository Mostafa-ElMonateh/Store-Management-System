//----------------------------------------------------------------------------
// -------------------------------- Variables --------------------------------
//----------------------------------------------------------------------------

// ---------------------
// __Product Variables__
// ---------------------
// get the name of a product
const getTitleElement = document.getElementById('productTitle');
// get the price of a product
const getPriceElement = document.getElementById('price');
// get taxes of a product
const getTaxesElement = document.getElementById('taxes');
// get a NodeList of [price && taxes]
const getElementsToCountTotal = document.querySelectorAll('.total-element');
// get total of a product
const getTotalElement = document.getElementById('total');
// get quantity of a product
const getQuantityElement = document.getElementById('quantity');
// get category select
const getCategorySelectElement = document.getElementById('categorySelect');
// get the button of creating a product
const getCreateProductButton = document.getElementById('createProduct');

// ----------------------
// __Category Variables__
// ----------------------
// get the name of a category
const getCategoryTitleElement = document.getElementById('categoryTitle');
// get CategoryToAction Select
const getCategorySelectToActionElement = document.getElementById('chooseCategoryToAction');
// get the button of updating a category
const getUpdateCategoryButton = document.getElementById('updateCategory');
// get the button of deleting a category
const getDeleteCategoryButton = document.getElementById('deleteCategory');
// get the button of creating a category
const getCreateCategoryButton = document.getElementById('createCategory');

// -------------------------
// __Individuals Variables__
// -------------------------
// get a NodeList of [product title && category title]
const getTextElementsToValidate = document.querySelectorAll('.text-validations');
// get all Product and Category Buttons
const getProductCategoryButtonsElement = document.querySelectorAll('.cud-Button');
// get all table heads
const getAllTableHeadsElement = document.getElementsByTagName('th');
// get Error Message
let errorMessage = document.createElement('p');
errorMessage.style.color = 'red';
// get Update Product
let getUpdateProductButton = document.createElement('button');
getUpdateProductButton.innerHTML = 'Update Product'
getUpdateProductButton.classList.add('cud-Button');
getUpdateProductButton.style.width = '100%';
getUpdateProductButton.style.marginTop = '5px';
// store Product Id to Update
let storeProductId;



//------------------------------------------------------------------------------
// -------------------------------- Validations --------------------------------
//------------------------------------------------------------------------------

// -------------------------------------------
// __Validations On Title && Category inputs__
// -------------------------------------------
getTextElementsToValidate.forEach(function (element) {
    element.addEventListener('blur', () => {
        if (element.value.length >= 20) {
            errorMessage.innerHTML = 'Invalid Text.. Enter a text with at least 20 characters..';
            element.insertAdjacentElement('afterend', errorMessage);
            element.focus();
            element.select();
        } else if (element.value == '' && element == getTitleElement) {
            errorMessage.innerHTML = 'Field is Required';
            element.insertAdjacentElement('afterend', errorMessage);
            element.focus();
            element.select();
        } else {
            errorMessage.innerHTML = '';
        }
    })
})


// ----------------------------------------
// __Validations On Price && Taxes inputs__
// ----------------------------------------
getElementsToCountTotal.forEach(function (element) {
    element.oninput = function () {
        element.value = element.value.replace(/[^0-9.]/g, '');
    };

    element.onblur = function () {
        if (element.value == '') {
            errorMessage.innerHTML = 'Field is Required..';
            document.querySelector('.money').insertAdjacentElement('afterend', errorMessage);
            element.focus();
            element.select();
        }
        else if (element == getPriceElement && element.value == 0) {
            errorMessage.innerHTML = `Don't Start With Zero..`;
            document.querySelector('.money').insertAdjacentElement('afterend', errorMessage);
            element.focus();
            element.select();
        } else if (/^0[0-9]/.test(element.value) || countOccurrences(element.value, '.') > 1 || element.value == '.') {
            errorMessage.innerHTML = 'Enter a VALID Input..';
            document.querySelector('.money').insertAdjacentElement('afterend', errorMessage);
            element.focus();
            element.select();
        } else {
            errorMessage.innerHTML = '';
        }
    }
});


//-----------------------------------
// __Validations On Quantity inputs__
//-----------------------------------
getQuantityElement.oninput = function () {
    getQuantityElement.value = getQuantityElement.value.replace(/[^0-9]/g, '');
};

getQuantityElement.onblur = function () {
    if (getQuantityElement.value == '') {
        errorMessage.innerHTML = 'Field is Required..';
        getQuantityElement.insertAdjacentElement('afterend', errorMessage);
        getQuantityElement.focus();
        getQuantityElement.select();
    }
    else if (getQuantityElement.value == 0) {
        errorMessage.innerHTML = `Don't Start With Zero..`;
        getQuantityElement.insertAdjacentElement('afterend', errorMessage);
        getQuantityElement.focus();
        getQuantityElement.select();
    } else if (/^0[0-9]/.test(getQuantityElement.value)) {
        errorMessage.innerHTML = 'Enter a VALID Input..';
        getQuantityElement.insertAdjacentElement('afterend', errorMessage);
        getQuantityElement.focus();
        getQuantityElement.select();
    } else {
        errorMessage.innerHTML = '';
    }
}


//-----------------------------------------------------------------------------
// ----------------------------- CRUD on Products -----------------------------
//-----------------------------------------------------------------------------

// -------------------
// __CREATE products__
// -------------------
getCreateProductButton.onclick = function () {
    let products;
    if (localStorage.products) {
        products = JSON.parse(localStorage.products);
    } else {
        products = [];
    }

    if (getTitleElement.value != '' && getPriceElement.value != '' &&
        getTaxesElement.value != '' && getQuantityElement.value != '' &&
        getCategorySelectElement.value != '' && getCategorySelectElement.value !== 'Choose a Category') {

        if (ensureExistence(products, getTitleElement.value)) {
            errorMessage.innerHTML = 'This is already product with this name..';
            getCreateProductButton.insertAdjacentElement('afterend', errorMessage);
            return;
        }

        let newProduct = {
            title: getTitleElement.value,
            price: getPriceElement.value,
            taxes: getTaxesElement.value,
            total: getTotalElement.innerHTML,
            quantity: getQuantityElement.value,
            category: getCategorySelectElement.value
        }
        products.unshift(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        clearInputs();
        getTotalElement.style.background = 'rgba(255, 17, 17, 0.655)';
    } else {
        errorMessage.innerHTML = 'Fill empty Boxes..';
        getCreateProductButton.insertAdjacentElement('afterend', errorMessage);
    }
    readProducts();
    readCategories();
};


// -----------------
// __READ Products__
// -----------------
function readProducts() {
    const products = JSON.parse(localStorage.getItem('products'));
    let createProductsTable = '';
    for (let i = 0; i < products.length; i++) {
        createProductsTable += `
        <tr>
        <td class='tableCell'>${i + 1}</td>
        <td class='tableCell'>${products[i].title}</td>
        <td class='tableCell'>${products[i].price}</td>
        <td class='tableCell'>${products[i].taxes}</td>
        <td class='tableCell'>${products[i].total}</td>
        <td class='tableCell'>${products[i].quantity}</td>
        <td class='tableCell'>${products[i].category}</td>

        <td class='tableCell' onclick='updateProduct(event)'><i class="fas fa-edit" id="update-product_${i}" title="Update" style="color:yellow";></i></td>
        <td class='tableCell' onclick='deleteProduct(event)'><i class="fa-solid fa-trash" id="delete-product_${i}" title="Delete" style="color:red;"></i></td>
        </tr>
        `;
    }

    document.getElementById('tableBody').innerHTML = createProductsTable;
    if (document.querySelector('.tableCell')) {
        for (let i = 0; i < getAllTableHeadsElement.length; i++) {
            getAllTableHeadsElement[i].style.color = 'green';
        }
    }
    else {
        for (let i = 0; i < getAllTableHeadsElement.length; i++) {
            getAllTableHeadsElement[i].style.color = '#fff';
        }
    }
}


// -------------------
// __DELETE Products__
// -------------------
function deleteProduct(e) {
    const products = JSON.parse(localStorage.getItem('products'));
    const getProductId = e.target.id.split('_')[1];
    products.splice(getProductId, 1);
    localStorage.setItem('products', JSON.stringify(products));
    readProducts();
}


// -------------------
// __UPDATE Products__
// -------------------
function updateProduct(e) {
    getCreateProductButton.style.display = 'none';
    getUpdateProductButton.style.display = 'block';
    getCategorySelectElement.insertAdjacentElement('afterend', getUpdateProductButton);

    let getAllProducts = JSON.parse(localStorage.getItem('products'));
    const getProductId = e.target.id.split('_')[1];
    const getProductToUpdate = getAllProducts[getProductId];

    getTitleElement.value = getProductToUpdate.title;
    getPriceElement.value = getProductToUpdate.price;
    getTaxesElement.value = getProductToUpdate.taxes;
    getTotalElement.innerHTML = getProductToUpdate.total;
    getTotalElement.style.backgroundColor = '#040';
    getQuantityElement.value = getProductToUpdate.quantity;
    getCategorySelectElement.value = getProductToUpdate.category;

    storeProductId = getProductId;
}


//-----------------------------------------------------------------------------
// ---------------------------- CRUD on Categories ----------------------------
//-----------------------------------------------------------------------------


// ---------------------
// __CREATE Categories__
// ---------------------
getCreateCategoryButton.onclick = function () {
    let categories;
    if (localStorage.categories) {
        categories = JSON.parse(localStorage.categories);
    } else {
        categories = [];
    }
    if (getCategoryTitleElement.value != '' && categories.length != 0) {
        categories = JSON.parse(localStorage.categories);
        if (ensureExistence(categories, getCategoryTitleElement.value)) {
            errorMessage.innerHTML = 'This is already category with this name..';
            getCategoryTitleElement.insertAdjacentElement('afterend', errorMessage);
            return;
        }
        let newCategory = {
            title: getCategoryTitleElement.value,
        }
        categories.unshift(newCategory);
        localStorage.setItem('categories', JSON.stringify(categories));
        getCategoryTitleElement.value = '';
        readCategories();
    } else if (categories.length == 0) {
        let newCategory = {
            title: getCategoryTitleElement.value,
        }
        categories.unshift(newCategory);
        localStorage.setItem('categories', JSON.stringify(categories));
        getCategoryTitleElement.value = '';
        readCategories();
    } else {
        errorMessage.innerHTML = 'Write the Category Title..';
        getCategoryTitleElement.insertAdjacentElement('afterend', errorMessage);
    }
    readProducts();
};


// -------------------
// __READ categories__
// -------------------
function readCategories() {
    getCategorySelectElement.innerHTML = '<option disabled selected>Choose a Category</option>';
    getCategorySelectToActionElement.innerHTML = '<option disabled selected>Choose Category to Update or Delete</option>';
    let getCategories = JSON.parse(localStorage.getItem('categories'));
    let categoriesList = ``;
    if (getCategories != null) {
        getCategories.forEach(function (element) {
            categoriesList += `<option>${element.title}</option>`;
        });
        getCategorySelectElement.innerHTML += categoriesList;
        getCategorySelectToActionElement.innerHTML += categoriesList;
    }
}


// ---------------------
// __DELETE categories__
// ---------------------
getDeleteCategoryButton.addEventListener('click', function () {
    let getAllcategories = JSON.parse(localStorage.categories);
    let getAllproducts = JSON.parse(localStorage.getItem('products'));

    // Check is the selected category has products before removing..
    if (getAllproducts.findIndex(function (product) {
        return product.category == getCategorySelectToActionElement.value;
    }) != -1) {
        errorMessage.innerHTML = 'This Category has products, please remove them first..';
        getCategorySelectToActionElement.insertAdjacentElement('afterend', errorMessage);
    } else {
        let selectedIndex = getCategorySelectToActionElement.selectedIndex;
        if (selectedIndex > 0) {
            getAllcategories.splice(selectedIndex - 1, 1);
            localStorage.setItem('categories', JSON.stringify(getAllcategories));
            readCategories();
        }
    }
});



//--------------------------------------------------------------------------------
// ------------------------------ Independed Blocks ------------------------------
//--------------------------------------------------------------------------------

// -------------------
// __GET Total Price__
// -------------------
getElementsToCountTotal.forEach(function (element) {
    element.addEventListener('keyup', () => {
        if (getPriceElement.value != '' && getPriceElement.value != 0 &&
            !(/^0[0-9]/.test(getTaxesElement.value)) && !(/^0[0-9]/.test(getPriceElement.value)) &&
            countOccurrences(element.value, '.') <= 1 && element.value != '.') {
            let totalPrice = Number(getPriceElement.value) + Number(getTaxesElement.value);
            getTotalElement.innerHTML = totalPrice;
            getTotalElement.style.background = '#040';
        } else {
            getTotalElement.innerHTML = '';
            getTotalElement.style.background = 'rgba(255, 17, 17, 0.655)';
        }
    });
});


// ----------------
// __CLEAR Inputs__
// ----------------
function clearInputs() {
    getTitleElement.value = '';
    getPriceElement.value = '';
    getTaxesElement.value = '';
    getTotalElement.innerHTML = '';
    getQuantityElement.value = '';
    getCategorySelectElement.innerHTML = '<option disabled selected>Choose a Category</option>';
    getCreateCategoryButton.value = '';
}


// ---------------------------------------
// __Ensure that str is in an arr or not__
// ---------------------------------------
function ensureExistence(arr, str) {
    if (arr.length == 0) return false;
    return arr.some(element => String(element.title.replace(/ /g, "")).toLowerCase().trim() === String(str.replace(/ /g, "")).toLowerCase().trim());
}

/* ---------------------------------------
__REMOVE error message when
createProduct + createCategory + updateCategory + deleteCategory
on bluring__
--------------------------------------- */
getProductCategoryButtonsElement.forEach((element) => {
    element.addEventListener('blur', () => {
        errorMessage.innerHTML = '';
    })
})


// ----------------------------------------------------
// __COUNT occurrences of a specific char in a string__
// ----------------------------------------------------
function countOccurrences(str, charToCount) {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
        if (str.charAt(i) === charToCount) {
            count++;
        }
    }
    return count;
}


getUpdateProductButton.onclick = () => {
    let getAllProducts = JSON.parse(localStorage.getItem('products'));
    const getProductId = storeProductId;

    let updatedProduct = {
        title: getTitleElement.value,
        price: getPriceElement.value,
        taxes: getTaxesElement.value,
        total: getTotalElement.innerHTML,
        quantity: getQuantityElement.value,
        category: getCategorySelectElement.value
    }

    getAllProducts[getProductId] = updatedProduct;
    localStorage.setItem('products', JSON.stringify(getAllProducts));

    readProducts();
    clearInputs();
    readCategories();
    getTotalElement.style.background = 'rgba(255, 17, 17, 0.655)';
    getUpdateProductButton.style.display = 'none';
    getCreateProductButton.style.display = 'block';
}


// ---------
// __Calls__
// ---------
readProducts();
readCategories();