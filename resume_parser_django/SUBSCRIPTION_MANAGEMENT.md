# Subscription Management System

Complete subscription management with cancellation, reactivation, upgrade, and history tracking.

## 🔄 **Subscription Management Endpoints**

### 1. **Cancel Subscription**

#### Immediate Cancellation
```http
POST /api/payments/subscription/cancel/
Authorization: Bearer <token>
Content-Type: application/json

{
  "cancel_type": "immediate"
}
```

#### End-of-Period Cancellation
```http
POST /api/payments/subscription/cancel/
Authorization: Bearer <token>
Content-Type: application/json

{
  "cancel_type": "end_of_period"
}
```

**Response:**
```json
{
  "message": "Subscription cancelled immediately",
  "subscription_status": "cancelled",
  "cancelled_at": "2024-01-15T10:30:00Z"
}
```

### 2. **Reactivate Subscription**
```http
POST /api/payments/subscription/reactivate/
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Subscription reactivated successfully",
  "subscription_status": "active",
  "plan_name": "Professional"
}
```

### 3. **Upgrade Subscription**
```http
POST /api/payments/subscription/upgrade/
Authorization: Bearer <token>
Content-Type: application/json

{
  "plan_id": 3
}
```

**Response:**
```json
{
  "message": "Subscription upgraded from Basic to Professional",
  "old_plan": "Basic",
  "new_plan": "Professional",
  "new_price": 29.99,
  "currency": "USD"
}
```

### 4. **Subscription History**
```http
GET /api/payments/subscription/history/
Authorization: Bearer <token>
```

**Response:**
```json
{
  "subscription_history": [
    {
      "id": 1,
      "plan_name": "Professional",
      "status": "active",
      "start_date": "2024-01-01T00:00:00Z",
      "end_date": null,
      "cancelled_at": null,
      "created_at": "2024-01-01T00:00:00Z",
      "price": 29.99,
      "currency": "USD"
    },
    {
      "id": 2,
      "plan_name": "Basic",
      "status": "cancelled",
      "start_date": "2023-12-01T00:00:00Z",
      "end_date": "2023-12-31T23:59:59Z",
      "cancelled_at": "2023-12-15T10:30:00Z",
      "created_at": "2023-12-01T00:00:00Z",
      "price": 9.99,
      "currency": "USD"
    }
  ]
}
```

## 🎯 **Cancellation Types**

### **Immediate Cancellation**
- ✅ Subscription stops immediately
- ❌ User loses access to premium features right away
- 💰 No refund (unless manually processed)
- 🔄 Can be reactivated later

### **End-of-Period Cancellation**
- ✅ User keeps access until current period ends
- ✅ No immediate loss of features
- 💰 Pays for full current period
- 🔄 Can be reactivated before period ends

## 🔧 **Frontend Integration Examples**

### **Cancel Subscription Component**
```javascript
const cancelSubscription = async (cancelType) => {
  try {
    const response = await fetch('/api/payments/subscription/cancel/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cancel_type: cancelType })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert(data.message);
      // Update UI to reflect cancelled status
      updateSubscriptionStatus('cancelled');
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error('Cancellation error:', error);
  }
};

// Usage
cancelSubscription('immediate'); // Cancel right away
cancelSubscription('end_of_period'); // Cancel at period end
```

### **Reactivate Subscription Component**
```javascript
const reactivateSubscription = async () => {
  try {
    const response = await fetch('/api/payments/subscription/reactivate/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert(data.message);
      // Update UI to reflect active status
      updateSubscriptionStatus('active');
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error('Reactivation error:', error);
  }
};
```

### **Upgrade Subscription Component**
```javascript
const upgradeSubscription = async (newPlanId) => {
  try {
    const response = await fetch('/api/payments/subscription/upgrade/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ plan_id: newPlanId })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert(data.message);
      // Update UI with new plan details
      updatePlanDetails(data.new_plan, data.new_price);
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error('Upgrade error:', error);
  }
};
```

### **Subscription History Component**
```javascript
const getSubscriptionHistory = async () => {
  try {
    const response = await fetch('/api/payments/subscription/history/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Display subscription history
      displayHistory(data.subscription_history);
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error('History error:', error);
  }
};

const displayHistory = (history) => {
  const historyContainer = document.getElementById('subscription-history');
  
  history.forEach(sub => {
    const historyItem = `
      <div class="history-item">
        <h4>${sub.plan_name} - $${sub.price} ${sub.currency}</h4>
        <p>Status: ${sub.status}</p>
        <p>Started: ${new Date(sub.start_date).toLocaleDateString()}</p>
        ${sub.cancelled_at ? `<p>Cancelled: ${new Date(sub.cancelled_at).toLocaleDateString()}</p>` : ''}
      </div>
    `;
    historyContainer.innerHTML += historyItem;
  });
};
```

## 🎨 **UI/UX Recommendations**

### **Cancellation Flow**
1. **Show current plan details** before cancellation
2. **Explain the difference** between immediate and end-of-period cancellation
3. **Confirm the action** with a modal/dialog
4. **Show what features will be lost** after cancellation
5. **Offer reactivation option** after cancellation

### **Upgrade Flow**
1. **Compare current vs new plan** side by side
2. **Show price difference** and new features
3. **Confirm the upgrade** with clear pricing
4. **Update UI immediately** after successful upgrade

### **History Display**
1. **Timeline view** of subscription changes
2. **Status indicators** (active, cancelled, expired)
3. **Plan comparison** showing what changed
4. **Action buttons** for reactivation if applicable

## 🔒 **Security Considerations**

- **Authentication required** for all subscription management
- **User can only manage their own subscription**
- **Audit trail** of all subscription changes
- **Stripe integration** for payment-related changes
- **Rate limiting** on cancellation/reactivation endpoints

## 📊 **Business Logic**

### **Cancellation Rules**
- Users can cancel anytime
- Immediate cancellation stops access immediately
- End-of-period cancellation maintains access until period ends
- Cancelled subscriptions can be reactivated

### **Upgrade Rules**
- Users can upgrade anytime
- New plan takes effect immediately
- Prorated billing handled by Stripe
- Usage limits updated to new plan

### **Reactivation Rules**
- Only cancelled subscriptions can be reactivated
- Reactivation restores previous plan
- No additional charges for reactivation
- Access restored immediately

This comprehensive subscription management system gives users full control over their subscriptions while maintaining business rules and security! 🚀 