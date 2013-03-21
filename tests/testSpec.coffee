"use strict"

east_asian_width = unicodeEastAsianWidth.east_asian_width
binary_range_search = unicodeEastAsianWidth.binary_range_search

describe "Unicode EastAsianWidth", ->
  describe "East asian character width", ->
    it "can count hiragana", ->
      expect(east_asian_width("こんにちわ")).toEqual 10
    it "can count kanji", ->
      expect(east_asian_width("渋川喜規")).toEqual 8
    it "can count alphabet", ->
      expect(east_asian_width("abcDEF123!$%")).toEqual 12
  describe "Binary range search", ->
    it "can match boundary", ->
      expect(binary_range_search([1], [5], 1)).toBeTruthy()
    it "can match in range", ->
      expect(binary_range_search([1], [5], 2)).toBeTruthy()
    it "can match in boundary2", ->
      expect(binary_range_search([1, 5], [3, 7], 1)).toBeTruthy()
    it "can match in boundary3", ->
      expect(binary_range_search([1, 5], [3, 7], 5)).toBeTruthy()
    it "can match in range2", ->
      expect(binary_range_search([1, 5], [3, 7], 2)).toBeTruthy()
    it "can match in range3", ->
      expect(binary_range_search([1, 5], [3, 7], 6)).toBeTruthy()
    it "can match in boundary4", ->
      expect(binary_range_search([1, 5], [3, 7], 7)).toBeTruthy()
    it "can check value is out of range", ->
      expect(binary_range_search([3], [5], 1)).toBeFalsy()
    it "can check value is out of range2", ->
      expect(binary_range_search([1, 5], [3, 7], 0)).toBeFalsy()
    it "can check value is out of range3", ->
      expect(binary_range_search([1, 5], [3, 7], 4)).toBeFalsy()
    it "can check value is out of range4", ->
      expect(binary_range_search([1, 5], [3, 7], 8)).toBeFalsy()
