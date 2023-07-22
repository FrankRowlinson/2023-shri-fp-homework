/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import * as R from "ramda";

import { SHAPES, COLORS } from "../constants";

const isWhite = R.propEq(R.__, COLORS.WHITE);
const isGreen = R.propEq(R.__, COLORS.GREEN);
const isBlue = R.propEq(R.__, COLORS.BLUE);
const isRed = R.propEq(R.__, COLORS.RED);
const isOrange = R.propEq(R.__, COLORS.ORANGE);

const getAllColors = R.props([
  SHAPES.STAR,
  SHAPES.SQUARE,
  SHAPES.TRIANGLE,
  SHAPES.CIRCLE,
]);

const isStarGreen = isGreen(SHAPES.STAR);
const isSquareGreen = isGreen(SHAPES.SQUARE);
const isTriangleGreen = isGreen(SHAPES.TRIANGLE);
const isCircleGreen = isGreen(SHAPES.CIRCLE);

// const isStarWhite = isWhite(SHAPES.STAR);
const isSquareWhite = isWhite(SHAPES.SQUARE);
const isTriangleWhite = isWhite(SHAPES.TRIANGLE);
const isCircleWhite = isWhite(SHAPES.CIRCLE);

const isStarOrange = isOrange(SHAPES.STAR);
const isSquareOrange = isOrange(SHAPES.SQUARE);
const isTriangleOrange = isOrange(SHAPES.TRIANGLE);
const isCircleOrange = isOrange(SHAPES.CIRCLE);

const isStarRed = isRed(SHAPES.STAR);
// const isSquareRed = isRed(SHAPES.SQUARE);
// const isTriangleRed = isRed(SHAPES.TRIANGLE);
// const isCircleRed = isRed(SHAPES.CIRCLE);

// const isStarBlue = isBlue(SHAPES.STAR);
// const isSquareBlue = isBlue(SHAPES.SQUARE);
// const isTriangleBlue = isBlue(SHAPES.TRIANGLE);
const isCircleBlue = isBlue(SHAPES.CIRCLE);

const checkEqualityInArray = R.apply(R.equals, R.__);

// order: star, square, triangle, circle

// 1. Красная звезда, зеленый квадрат, все остальные белые.

export const validateFieldN1 = R.allPass([
  isStarRed,
  isSquareGreen,
  isTriangleWhite,
  isCircleWhite,
]);

// 2. Как минимум две фигуры зеленые.
const countGreenShapes = R.count(R.equals(COLORS.GREEN), R.__);
const countGreenShapesFromProps = R.compose(countGreenShapes, getAllColors);
const moreThanOneGreenShape = R.gt(R.__, 1);

export const validateFieldN2 = R.compose(
  moreThanOneGreenShape,
  countGreenShapesFromProps
);

// 3. Количество красных фигур равно кол-ву синих.
const countBlueShapes = R.count(R.equals(COLORS.BLUE), R.__);
const countRedShapes = R.count(R.equals(COLORS.RED), R.__);

const countBlueShapesFromProps = R.compose(countBlueShapes, getAllColors);
const countRedShapesFromProps = R.compose(countRedShapes, getAllColors);

const getArrayOfBlueRedCounts = R.juxt([
  countBlueShapesFromProps,
  countRedShapesFromProps,
]);

export const validateFieldN3 = R.compose(
  checkEqualityInArray,
  getArrayOfBlueRedCounts
);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = R.allPass([
  isStarRed,
  isSquareOrange,
  isCircleBlue,
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
const countWhiteShapes = R.count(R.equals(COLORS.WHITE), R.__);
const countWhiteShapesFromProps = R.compose(countWhiteShapes, getAllColors);
const lessThanTwoShapes = R.lt(R.__, 2);

export const validateFieldN5 = R.compose(
  lessThanTwoShapes,
  countWhiteShapesFromProps
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
const exactlyOneShape = R.equals(R.__, 1);
const exactlyTwoShapes = R.equals(R.__, 2);

const exactlyOneRedShape = R.compose(exactlyOneShape, countRedShapesFromProps);
const exactlyTwoGreenShapes = R.compose(
  exactlyTwoShapes,
  countGreenShapesFromProps
);

export const validateFieldN6 = R.allPass([
  isTriangleGreen,
  exactlyOneRedShape,
  exactlyTwoGreenShapes,
]);

// 7. Все фигуры оранжевые.

export const validateFieldN7 = R.allPass([
  isStarOrange,
  isSquareOrange,
  isTriangleOrange,
  isCircleOrange,
]);

// 8. Не красная и не белая звезда, остальные – любого цвета.

const starIsRed = isRed(SHAPES.STAR);
const starIsWhite = isWhite(SHAPES.STAR);

const starIsRedOrWhite = R.anyPass([starIsRed, starIsWhite]);
const starIsNotRedOrWhite = R.compose(R.not, starIsRedOrWhite);

export const validateFieldN8 = (shapes) => starIsNotRedOrWhite(shapes);

// 9. Все фигуры зеленые.

export const validateFieldN9 = R.allPass([
  isStarGreen,
  isSquareGreen,
  isTriangleGreen,
  isCircleGreen,
]);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета

const getSquareAndTriangleColors = R.props([SHAPES.SQUARE, SHAPES.TRIANGLE]);
const squareAndTriangleShareColor = R.compose(
  checkEqualityInArray,
  getSquareAndTriangleColors
);

const squareAndTriangleAreWhite = R.anyPass([isTriangleWhite, isSquareWhite]);
const squareAndTriangleAreNotWhite = R.compose(
  R.not,
  squareAndTriangleAreWhite
);

export const validateFieldN10 = R.allPass([
  squareAndTriangleShareColor,
  squareAndTriangleAreNotWhite,
]);
