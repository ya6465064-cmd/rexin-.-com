// مصفوفة المنتجات الأساسية بصورك الرجالي الحقيقية والأسعار الجديدة
const defaultProducts = [
    { id: 1, name: "تيشرت REXIN الأسود - لوجو أمامي", price: 500, category: "men", image: "70303.jpg" },
    { id: 2, name: "تيشرت REXIN الأبيض - No Risk No Fun", price: 500, category: "men", image: "70300.jpg" },
    { id: 3, name: "عرض خاص: قطعتين تيشرت REXIN (أبيض + أسود)", price: 900, category: "men", image: "70298.jpg" },
    { id: 4, name: "تيشرت REXIN الأسود - No Risk No Fun خلفي", price: 500, category: "men", image: "70302.jpg" }
];

// السطر ده مهم جداً: بيمسح الكاش القديم عشان يجبر الموقع يعرض صور التيشرتات الجديدة فوراً وم تطلعش مكسورة
if (localStorage.getItem("store_products") && !localStorage.getItem("v2_updated")) {
    localStorage.removeItem("store_products");
    localStorage.setItem("v2_updated", "true");
}

let products = JSON.parse(localStorage.getItem("store_products")) || defaultProducts;
if (!localStorage.getItem("store_products")) {
    localStorage.setItem("store_products", JSON.stringify(defaultProducts));
}

let cart = [];

// عرض المنتجات بالموقع الرئيسي
function displayProducts() {
    const container = document.getElementById("products-container");
    if(!container) return;
    container.innerHTML = "";

    products.forEach(p => {
        container.innerHTML += `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}">
                <h3>${p.name}</h3>
                <div class="price">${p.price} ج.م</div>
                <select id="size-${p.id}" class="size-select">
                    <option value="M">مقاس: M</option>
                    <option value="L">مقاس: L</option>
                    <option value="XL">مقاس: XL</option>
                    <option value="XXL">مقاس: XXL</option>
                </select>
                <button class="add-btn" onclick="addToCart(${p.id})">إضافة للسلة 🛒</button>
            </div>
        `;
    });
}

function toggleCartModal() {
    const modal = document.getElementById("cartModal");
    if(modal) modal.classList.toggle("open");
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const selectedSize = document.getElementById(`size-${id}`).value;

    cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        size: selectedSize
    });

    updateCartUI();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.getElementById("cart-count");
    if(cartCount) cartCount.innerText = cart.length;
    
    const itemsContainer = document.getElementById("cart-items-container");
    if(!itemsContainer) return;
    itemsContainer.innerHTML = "";

    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        itemsContainer.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong> <br>
                    <small>المقاس: ${item.size} | السعر: ${item.price} ج.م</small>
                </div>
                <span class="remove-item" onclick="removeFromCart(${index})">❌</span>
            </div>
        `;
    });

    document.getElementById("cart-total-price").innerText = total;
}

function sendOrderToInstagram() {
    const name = document.getElementById("customer-name").value.trim();
    const phone = document.getElementById("customer-phone").value.trim();
    const address = document.getElementById("customer-address").value.trim();

    if (cart.length === 0) {
        alert("سلتك فارغة! أضف بعض المنتجات أولاً.");
        return;
    }

    if (!name || !phone || !address) {
        alert("برجاء ملء جميع بيانات الشحن لتأكيد الأوردر!");
        return;
    }

    alert("سيتم نقلك الآن لصفحة إنستجرام المتجر، برجاء إرسال رسالة بطلبك لتأكيد الشحن!");
    const instagramURL = "https://www.instagram.com/rexin_.eg?igsh=MTJzaTF5aXhqYzg5ZQ==";

    cart = [];
    updateCartUI();
    toggleCartModal();
    window.open(instagramURL, "_blank");
}

// دالة عرض المنتجات في جدول لوحة التحكم (الأدمن)
function displayAdminProducts() {
    const tableBody = document.getElementById("admin-products-table");
    const totalStat = document.getElementById("total-products-stat");
    if (!tableBody) return;

    tableBody.innerHTML = "";
    if(totalStat) totalStat.innerText = products.length;

    products.forEach((p, index) => {
        tableBody.innerHTML += `
            <tr>
                <td><img src="${p.image}" style="width:45px; height:45px; object-fit:cover; border-radius:6px; border: 1px solid #333;"></td>
                <td>${p.name}</td>
                <td>رجالي</td>
                <td>${p.price} ج.م</td>
                <td><button class="btn-delete" onclick="adminDeleteProduct(${index})">حذف 🗑️</button></td>
            </tr>
        `;
    });
}

function adminAddProduct(e) {
    e.preventDefault();
    const name = document.getElementById("prod-name").value.trim();
    const price = parseInt(document.getElementById("prod-price").value);
    const image = document.getElementById("prod-image").value.trim();

    const newProduct = {
        id: Date.now(),
        name: name,
        price: price,
        category: "men",
        image: image
    };

    products.push(newProduct);
    localStorage.setItem("store_products", JSON.stringify(products));
    
    displayAdminProducts();
    document.getElementById("add-product-form").reset();
    alert("تم إضافة المنتج بنجاح للمتجر! 🎉");
}

function adminDeleteProduct(index) {
    if (confirm("هل أنت متأكد من حذف هذا المنتج نهائياً؟")) {
        products.splice(index, 1);
        localStorage.setItem("store_products", JSON.stringify(products));
        displayAdminProducts();
    }
}

// التشغيل التلقائي عند فتح الصفحة
if (document.getElementById("products-container")) {
    displayProducts();
}