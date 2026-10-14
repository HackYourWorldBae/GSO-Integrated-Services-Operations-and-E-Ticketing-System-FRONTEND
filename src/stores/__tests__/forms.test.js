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

  it('enforces terms_agreed to be strictly true', () => {
    store.leauBorrowingState.terms_agreed = false;
    store.v$.leauBorrowingState.terms_agreed.$touch();
    expect(store.v$.leauBorrowingState.terms_agreed.$invalid).toBe(true);

    store.leauBorrowingState.terms_agreed = true;
    expect(store.v$.leauBorrowingState.terms_agreed.$invalid).toBe(false);
  });

  it('validates purpose_project with minimum 3 characters', () => {
    store.leauBorrowingState.purpose_project = 'ab';
    store.v$.leauBorrowingState.purpose_project.$touch();
    expect(store.v$.leauBorrowingState.purpose_project.$invalid).toBe(true);

    store.leauBorrowingState.purpose_project = 'Event setup';
    expect(store.v$.leauBorrowingState.purpose_project.$invalid).toBe(false);
  });

  it('resets leauBorrowingState and validation on clearForms()', () => {
    store.leauBorrowingState.quantity_needed = 10;
    store.v$.leauBorrowingState.$touch();
    expect(store.v$.leauBorrowingState.$dirty).toBe(true);

    store.clearForms();
    expect(store.leauBorrowingState.quantity_needed).toBe('');
    expect(store.v$.leauBorrowingState.$dirty).toBe(false);
  });

  it('validates fgmuBorrowingState identically to leauBorrowingState', () => {
    expect(store.fgmuBorrowingState.quantity_needed).toBe('');
    store.v$.fgmuBorrowingState.quantity_needed.$touch();
    expect(store.v$.fgmuBorrowingState.quantity_needed.$invalid).toBe(true);

    store.fgmuBorrowingState.quantity_needed = 5;
    expect(store.v$.fgmuBorrowingState.quantity_needed.$invalid).toBe(false);

    store.fgmuBorrowingState.terms_agreed = false;
    store.v$.fgmuBorrowingState.terms_agreed.$touch();
    expect(store.v$.fgmuBorrowingState.terms_agreed.$invalid).toBe(true);

    store.fgmuBorrowingState.terms_agreed = true;
    expect(store.v$.fgmuBorrowingState.terms_agreed.$invalid).toBe(false);
  });

  it('synchronizes item_name and quantity_needed from items list', () => {
    store.fgmuBorrowingState.items = [
      { id: 1, name: 'Step Ladder', quantity: 2 },
      { id: 2, name: 'Shovel', quantity: 3 }
    ];

    store.syncBorrowingItems(store.fgmuBorrowingState);

    expect(store.fgmuBorrowingState.item_name).toBe('Step Ladder (2), Shovel (3)');
    expect(store.fgmuBorrowingState.quantity_needed).toBe(5);
  });

  it('commits draft item correctly via commitDraftItem', () => {
    store.fgmuBorrowingState.item_input_draft = 'Wheelbarrow';
    store.commitDraftItem(store.fgmuBorrowingState);

    expect(store.fgmuBorrowingState.items.length).toBe(1);
    expect(store.fgmuBorrowingState.items[0].name).toBe('Wheelbarrow');
    expect(store.fgmuBorrowingState.items[0].quantity).toBe(1);
    expect(store.fgmuBorrowingState.item_input_draft).toBe('');
    expect(store.fgmuBorrowingState.item_name).toBe('Wheelbarrow (1)');
    expect(store.fgmuBorrowingState.quantity_needed).toBe(1);
  });
});
