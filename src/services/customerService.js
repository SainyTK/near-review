const getCustomers = () => {
    const dataStr = localStorage.getItem('customers');
    return dataStr ? JSON.parse(dataStr) : [];
}

const addCustomer = (customer) => {
    const customers = getCustomers() || [];
    const oldVersion = customers.filter(c => c !== customer);
    return localStorage.setItem('customers', JSON.stringify([...oldVersion, customer]));
}

export default {
    getCustomers,
    addCustomer
}