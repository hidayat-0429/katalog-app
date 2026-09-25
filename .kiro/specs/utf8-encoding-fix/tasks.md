# Implementation Plan

- [ ] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - UTF-8 Build Failure Detection
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Test the specific files with invalid UTF-8 characters: CartItemRow.tsx and page.tsx
  - Test that Next.js build process fails for files containing invalid UTF-8 byte sequences (from Bug Condition in design)
  - The test assertions should match the Expected Behavior Properties from design: successful compilation without encoding errors
  - Run test on UNFIXED code with invalid UTF-8 characters in CartItemRow.tsx line 88 and page.tsx lines 108, 152
  - **EXPECTED OUTCOME**: Test FAILS with "stream did not contain valid UTF-8" errors (this is correct - it proves the bug exists)
  - Document counterexamples found: specific files and line numbers that cause build failures
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Visual and Functional Equivalence
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for files with valid UTF-8 encoding
  - Test that CartItemRow component renders correctly for valid input files
  - Test that page.tsx navigation and sorting functionality works for non-buggy components
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code for components without UTF-8 issues
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 3. Fix for UTF-8 encoding errors in TSX files

  - [ ] 3.1 Replace invalid UTF-8 characters in CartItemRow.tsx
    - Open `app/(main)/keranjang/CartItemRow.tsx`
    - Navigate to line 88: `{/* Subtotal � desktop only */}`
    - Replace invalid UTF-8 character with standard ASCII hyphen: `{/* Subtotal - desktop only */}`
    - Verify the comment maintains its semantic meaning
    - Save file with UTF-8 encoding
    - _Bug_Condition: isBugCondition(file) where file.containsInvalidUTF8Characters() from design_
    - _Expected_Behavior: expectedBehavior(result) - successful compilation without encoding errors from design_
    - _Preservation: Visual and functional equivalence - component renders identically from design_
    - _Requirements: 2.1, 2.2, 2.3, 3.1_

  - [ ] 3.2 Replace invalid UTF-8 characters in page.tsx
    - Open `app/(main)/page.tsx`
    - Navigate to line 108: `<option value="nama-asc">Nama A�Z</option>`
    - Replace invalid UTF-8 character with proper Unicode en dash: `<option value="nama-asc">Nama A–Z</option>`
    - Navigate to line 152: `? Kembali ke Beranda`
    - Replace invalid UTF-8 character with proper Unicode left arrow: `← Kembali ke Beranda`
    - Verify both changes maintain semantic meaning (sorting option A-Z, back navigation)
    - Save file with UTF-8 encoding
    - _Bug_Condition: isBugCondition(file) where file.containsInvalidUTF8Characters() from design_
    - _Expected_Behavior: expectedBehavior(result) - successful compilation without encoding errors from design_
    - _Preservation: Visual and functional equivalence - navigation and sorting work identically from design_
    - _Requirements: 2.1, 2.2, 2.3, 3.2, 3.3_

  - [ ] 3.3 Verify file encoding and scan for additional issues
    - Set editor/IDE to use UTF-8 encoding for all TypeScript/React files
    - Ensure no Byte Order Mark (BOM) is added that could cause issues
    - Use UTF-8 validation tools to scan for any other potential invalid UTF-8 sequences
    - Check for zero-width characters or other problematic Unicode points
    - _Bug_Condition: isBugCondition(file) where file.containsInvalidUTF8Characters() from design_
    - _Expected_Behavior: expectedBehavior(result) - successful compilation without encoding errors from design_
    - _Preservation: All existing functionality preserved from design_
    - _Requirements: 2.1, 2.2, 2.3, 3.4_

  - [ ] 3.4 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - UTF-8 Build Success Validation
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior (successful build process)
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1 on fixed files
    - **EXPECTED OUTCOME**: Test PASSES with successful Next.js build (confirms bug is fixed)
    - _Requirements: Expected Behavior Properties from design - successful compilation without encoding errors_

  - [ ] 3.5 Verify preservation tests still pass
    - **Property 2: Preservation** - Visual and Functional Equivalence
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2 on fixed files
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Verify CartItemRow component still renders identically
    - Verify navigation and sorting functionality still work identically
    - Confirm all tests still pass after fix (no regressions)

- [ ] 4. Checkpoint - Ensure all tests pass
  - Run complete Next.js build process: `npm run build`
  - Verify no UTF-8 encoding errors in build output
  - Test development server startup: `npm run dev`
  - Verify all React components render correctly in browser
  - Test user interactions: navigation links, sorting dropdown, cart functionality
  - Ensure all tests pass, ask the user if questions arise.