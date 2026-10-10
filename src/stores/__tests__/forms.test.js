import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useFormsStore } from '../forms';

describe('Forms Store - LEAU Borrowing Validation', () => {
  let store;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useFormsStore();
  });

  it('initializes quantity_needed as empty and flags it invalid when touched', () => {
    expect(store.leauBorrowingState.quantity_needed).toBe('');

    // Touch the validation
    store.v$.leauBorrowingState.quantity_needed.$touch();
    expect(store.v$.leauBorrowingState.quantity_needed.$invalid).toBe(true);
    expect(store.v$.leauBorrowingState.quantity_needed.$error).toBe(true);
  });

  it('rejects 0, negative numbers, and decimals for quantity_needed', () => {
    // 0 is invalid
    store.leauBorrowingState.quantity_needed = 0;
    store.v$.leauBorrowingState.quantity_needed.$touch();
    expect(store.v$.leauBorrowingState.quantity_needed.$invalid).toBe(true);

    // negative number is invalid
    store.leauBorrowingState.quantity_needed = -3;
    expect(store.v$.leauBorrowingState.quantity_needed.$invalid).toBe(true);

    // non-integer decimal is invalid
    store.leauBorrowingState.quantity_needed = 2.5;
    expect(store.v$.leauBorrowingState.quantity_needed.$invalid).toBe(true);
  });

  it('accepts valid positive integers for quantity_needed', () => {
    store.leauBorrowingState.quantity_needed = 1;
    store.v$.leauBorrowingState.quantity_needed.$touch();
    expect(store.v$.leauBorrowingState.quantity_needed.$invalid).toBe(false);
    expect(store.v$.leauBorrowingState.quantity_needed.$error).toBe(false);

    store.leauBorrowingState.quantity_needed = 15;
    expect(store.v$.leauBorrowingState.quantity_needed.$invalid).toBe(false);
  });

  it('resets leauBorrowingState and validation on clearForms()', () => {
    store.leauBorrowingState.quantity_needed = 10;
    store.v$.leauBorrowingState.$touch();
    expect(store.v$.leauBorrowingState.$dirty).toBe(true);

    store.clearForms();
    expect(store.leauBorrowingState.quantity_needed).toBe('');
    expect(store.v$.leauBorrowingState.$dirty).toBe(false);
  });
});
