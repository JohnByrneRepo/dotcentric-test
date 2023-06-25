class BasketComponent {
    constructor() {
      this.basketElement = document.getElementById('basket');
      this.dataUrl = 'https://jsonblob.com/api/jsonBlob/1121782524165767168';
      this.data = null;
    }

    async fetchData() {
      try {
        const response = await fetch(this.dataUrl);
        this.data = await response.json();
        this.displayData();
      } catch (error) {
        console.error('Error:', error);
      }
    }

    displayData() {
      const items = this.data.items;
      const totals = this.calculateTotals(items);
      let basketHTML = '<h1>Basket</h1>';
      basketHTML += '<h2>Items:</h2>';
      basketHTML += '<div>';

      items.forEach(item => {
        basketHTML += `
          <div class="product-box" data-code="${item.code}">
            <img class="product-image" src="${item.productImageUrl}" alt="${item.productImageAlt}">
            <div class="product-details">
              <h3>${item.name}</h3>
              <p>Code: ${item.code}</p>
              <p>Variant: ${item.variant}</p>
              <p>Quantity: 
                <button onclick="basket.increaseQuantity('${item.code}')">+</button>
                <span id="quantity-${item.code}">${item.quantity}</span>
                <button onclick="basket.decreaseQuantity('${item.code}')"
                ${item.quantity === 1 ? 'disabled' : ''}>-</button>
              </p>
              <p>Price: ${item.displayValue}</p>
              <p>Range: ${item.range}</p>
              <p>Format: ${item.format}</p>
              <button onclick="basket.removeItem('${item.code}')">Remove</button>
            </div>
          </div>
        `;
      });

      basketHTML += '</div>';
      basketHTML += '<div class="total-box">';
      basketHTML += `
        <h2>Total:</h2>
        <p>Total: &#163;${totals.totalDisplay.toFixed(2)}</p>
      `;
      basketHTML += '</div>';

      this.basketElement.innerHTML = basketHTML;
    }

    calculateTotals(items) {
      let subTotal = 0;

      items.forEach(item => {
        const itemTotal = item.quantity * item.unitPrice;
        subTotal += itemTotal;
      });

      return {
        totalDisplay: subTotal,
      };
    }

    increaseQuantity(code) {
      const quantityElement = document.getElementById(`quantity-${code}`);
      let quantity = parseInt(quantityElement.textContent);
      quantity++;
      quantityElement.textContent = quantity;

      this.updateTotals();
      this.updateDecreaseButtonVisibility(code, quantity);
      this.displayData();
    }

    decreaseQuantity(code) {
      const quantityElement = document.getElementById(`quantity-${code}`);
      let quantity = parseInt(quantityElement.textContent);
      if (quantity > 1) {
        quantity--;
        quantityElement.textContent = quantity;

        this.updateTotals();
      }
      this.updateDecreaseButtonVisibility(code, quantity);
      this.displayData();
    }

    removeItem(code) {
      const itemIndex = this.data.items.findIndex(item => item.code === code);
      if (itemIndex !== -1) {
        this.data.items.splice(itemIndex, 1);
        this.updateTotals();
        this.displayData();
      }
    }

    updateTotals() {
      const items = Array.from(document.querySelectorAll('div[data-code]'));
      const updatedItems = items.map(item => {
        const code = item.getAttribute('data-code');
        const quantity = parseInt(document.getElementById(`quantity-${code}`).textContent);
        return {
          code,
          quantity,
        };
      });

      this.data.items = this.data.items.map(item => {
        const updatedItem = updatedItems.find(i => i.code === item.code);
        if (updatedItem) {
          item.quantity = updatedItem.quantity;
        }
        return item;
      });
    }

    updateDecreaseButtonVisibility(code, quantity) {
      const decreaseButton = document.querySelector(`div[data-code="${code}"] button[onclick="basket.decreaseQuantity('${code}')"]`);
      if (decreaseButton) {
        decreaseButton.disabled = quantity === 1;
      }
    }

    init() {
      this.fetchData();
    }
  }