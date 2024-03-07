const getProductSum = (soldCount, price)=>{
    let num1;
    let num2;
    try {
        num1 = parseFloat(soldCount.replace(',', '.'));
        num2 = parseFloat(price.replace(',', '.'));
    }
    catch (e){
        return "";
    }

    if (isNaN(num1) || isNaN(num2)) {
        return '';
    }

    const result = num1 * num2;
    return result.toFixed(2);
}

export default getProductSum;