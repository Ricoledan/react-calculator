import './App.css';
import React, {useState} from "react"

import Wrapper from "./components/Wrapper";
import Screen from "./components/Screen";
import ButtonBox from "./components/ButtonBox";
import Button from "./components/Button";

const btnValues = [
    ["C", "+-", "%", "/"],
    [7, 8, 9, "X"],
    [4, 5, 6, "-"],
    [1, 2, 3, "+"],
    [0, ".", "="],
];

const toLocaleString = (num) =>
    String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

const removeSpaces = (num) => num.toString().replace(/\s/g, "");

const App = () => {

    let [calc, setCalc] = useState({
        sign: "",
        num: 0,
        res: 0,
    });

    // numClickHandler function gets triggered only if any of the number buttons (0–9) are pressed
    const numClickHandler = (e) => {
        e.preventDefault();
        const value = e.target.innerHTML;

        if (removeSpaces(calc.num).length < 16) {
            setCalc({
                ...calc,
                num:
                    calc.num === 0 && value === "0"
                        ? "0"
                        : removeSpaces(calc.num) % 1 === 0
                            ? toLocaleString(Number(removeSpaces(calc.num + value)))
                            : toLocaleString(calc.num + value),
                res: !calc.sign ? 0 : calc.res,
            });
        }
    };

    // commaClickHandler function gets fired only if the decimal point (.) is pressed. It adds the decimal point to the current num value, making it a decimal number.
    const commaClickHandler = (e) => {
        e.preventDefault();
        const value = e.target.innerHTML;

        setCalc({
            ...calc,
            num: !calc.num.toString().includes(".") ? calc.num + value : calc.num,
        });
    };

    // signClickHandler function gets fired when the user press either +, –, * or /. The particular value is then set as a current sign value in the calc object
    const signClickHandler = (e) => {
        e.preventDefault();
        const value = e.target.innerHTML;
        setCalc({
            ...calc,
            sign: value,
            res: !calc.res && calc.num ? calc.num : calc.res,
            num: 0,
        });
    }

    // equalsClickHandler function calculates the result when the equals button (=) is pressed. The calculation is based on the current num and res value, as well as the sign selected (see the math function).
    const equalsClickHandler = () => {
        if (calc.sign && calc.num) {
            const math = (a, b, sign) =>
                sign === "+"
                    ? a + b
                    : sign === "-"
                        ? a - b
                        : sign === "X"
                            ? a * b
                            : a / b;

            setCalc({
                ...calc,
                res:
                    calc.num === "0" && calc.sign === "/"
                        ? "Can't divide with 0"
                        : math(Number(calc.res), Number(calc.num), calc.sign),
                sign: "",
                num: 0,
            });
        }
    };

    // invertClickHandler function first checks if there’s any entered value (num) or calculated value (res) and then inverts them by multiplying with -1
    const invertClickHandler = () => {
        setCalc({
            ...calc,
            num: calc.num ? calc.num * -1 : 0,
            res: calc.res ? calc.res * -1 : 0,
            sign: "",
        })
    }

    // percentClickHandler function checks if there’s any entered value (num) or calculated value (res) and then calculates the percentage using the built-in Math.pow function, which returns the base to the exponent power
    const percentClickHandler = () => {
        let num = calc.num ? parseFloat(calc.num) : 0;
        let res = calc.res ? parseFloat(calc.res) : 0;

        setCalc({
            ...calc,
            num: (num /= Math.pow(100, 1)),
            res: (res /= Math.pow(100, 1)),
            sign: "",
        });
    };

    // resetClickHandler function defaults all the initial values of calc, returning the calc state as it was when the Calculator app was first rendered
    const resetClickHandler = () => {
        setCalc({
            ...calc,
            sign: "",
            num: 0,
            res: 0,
        });
    };

    return (
        <Wrapper>
            <Screen value={calc.num ? calc.num : calc.res}/>
            <ButtonBox>
                {
                    btnValues.flat().map((btn, i) => {
                        return (
                            <Button
                                key={i}
                                className={btn === "=" ? "equals" : ""}
                                value={btn}
                                onClick={
                                    btn === "C"
                                        ? resetClickHandler
                                        : btn === "+-"
                                            ? invertClickHandler
                                            : btn === "%"
                                                ? percentClickHandler
                                                : btn === "="
                                                    ? equalsClickHandler
                                                    : btn === "/" || btn === "X" || btn === "-" || btn === "+"
                                                        ? signClickHandler
                                                        : btn === "."
                                                            ? commaClickHandler
                                                            : numClickHandler
                                }
                            />
                        );
                    })
                }
            </ButtonBox>
        </Wrapper>
    );
}

export default App;
