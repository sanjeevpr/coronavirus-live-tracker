import numeral from "numeral"

export const prettyPrint = number => 
    number ? `+${numeral(number).format("0.0a")}` : "+0"; 