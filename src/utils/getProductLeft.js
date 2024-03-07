const getProductSold = (state, delivered, left, returned)=>{
    try {
        if(left === "") return "?";
        const result = Number(state) + Number(delivered) - Number(left) - Number(returned);
        return isNaN(result) ? "Brak" : result.toFixed(2);
    }
    catch (e) {
        return "Brak";
    }
}

export default getProductSold;