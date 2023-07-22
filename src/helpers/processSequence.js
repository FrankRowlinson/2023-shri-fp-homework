/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import * as R from "ramda";
import _ from "lodash";

import Api from "../tools/api";

const {
  __,
  gt,
  lt,
  length,
  compose,
  test,
  prop,
  both,
  allPass,
  ifElse,
  concat,
  otherwise,
  mathMod,
  andThen,
  tap,
  partial,
  pipe,
  assoc,
} = R;
const { toNumber, toString, round } = _;

// init
const api = new Api();

// constants
const numberRegexp = /^\d+(\.\d+)?$/;
const URLS = {
  BASE_NUMBERS: "https://api.tech/numbers/base",
  BASE_ANIMALS: "https://animals.tech/",
};
const ERRORS = {
  VALIDATION_ERROR: "ValidationError",
};
const PROPS = {
  RESULT: "result",
  NUMBER: "number",
};

// validation
const isLessThan10 = lt(__, 10);
const isMoreThan2 = gt(__, 2);
const isInBoundaries = both(isLessThan10, isMoreThan2);
const isLengthValid = compose(isInBoundaries, length);
const isNumber = test(numberRegexp);
const isInputValid = allPass([isLengthValid, isNumber]);

// mutation
const addNumberToProps = assoc(PROPS.NUMBER, __, { from: 10, to: 2 });
const getResult = pipe(prop(PROPS.RESULT), toString);
const square = (value) => value ** 2;
const mod3 = mathMod(__, 3);
const formUrlToGetAnimal = concat(URLS.BASE_ANIMALS);

// api
const convertToBinaryBase = pipe(addNumberToProps, api.get(URLS.BASE_NUMBERS));
const getAnimal = api.get(__, {});

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const handleValidationError = partial(handleError, [ERRORS.VALIDATION_ERROR]);
  const tapWriteLog = tap(writeLog);
  const runSequence = pipe(
    toNumber,
    round,
    tapWriteLog,
    convertToBinaryBase,
    andThen(getResult),
    andThen(tapWriteLog),
    andThen(length),
    andThen(tapWriteLog),
    andThen(square),
    andThen(tapWriteLog),
    andThen(mod3),
    andThen(tapWriteLog),
    andThen(toString),
    andThen(formUrlToGetAnimal),
    andThen(getAnimal),
    andThen(getResult),
    andThen(handleSuccess),
    otherwise(handleError)
  );

  const runIfValid = ifElse(isInputValid, runSequence, handleValidationError);

  const app = compose(runIfValid, tapWriteLog);

  app(value);
};

export default processSequence;
