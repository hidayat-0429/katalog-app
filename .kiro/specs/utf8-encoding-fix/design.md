# UTF-8 Encoding Fix Bugfix Design

## Overview

This bugfix addresses UTF-8 encoding errors in React TypeScript (TSX) files that prevent the Next.js build process from completing successfully. The bug manifests when the Next.js compiler encounters invalid UTF-8 byte sequences in source code files, causing build failures with "stream did not contain valid UTF-8" errors. The fix involves identifying and replacing invalid UTF-8 characters with their correct Unicode equivalents while preserving all existing functionality and visual appearance.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the build failure - when TSX files contain invalid UTF-8 byte sequences that the Next.js compiler cannot process
- **Property (P)**: The desired behavior when files are processed - successful compilation without encoding errors
- **Preservation**: Existing component functionality, UI display, and user interactions that must remain unchanged by the fix
- **Invalid UTF-8 Character**: Byte sequences in source files that do not conform to valid UTF-8 encoding standards
- **Next.js Compiler**: The build system component that processes React/TypeScript files during development and production builds
- **TSX File**: TypeScript React files with `.tsx` extension containing React component code

## Bug Details

### Bug Condition

The bug manifests when the Next.js build process attempts to read and compile TSX files containing invalid UTF-8 character sequences. The compiler fails to process these files, causing the entire build pipeline to halt with encoding errors.

**Formal Specification:**
```
FUNCTION isBugCondition(file)
  INPUT: file of type TSXFile
  OUTPUT: boolean
  
  RETURN file.containsInvalidUTF8Characters()
         AND nextjsCompiler.isProcessing(file)
         AND NOT file.canBeCompiled()
END FUNCTION
```

### Examples

- **CartItemRow.tsx line 88**: `{/* Subtotal � desktop only */}` - Invalid character in comment causing build failure
- **HomePage page.tsx line 108**: `<option value="nama-asc">Nama A�Z</option>` - Invalid character in JSX attribute causing build failure  
- **HomePage page.tsx line 152**: `? Kembali ke Beranda` - Invalid character at start of text causing build failure
- **Edge case**: Files with multiple invalid UTF-8 characters should all be fixed in one operation

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- All React component functionality must continue to work exactly as before
- UI display and styling must remain visually identical to users
- User interactions (clicks, form submissions, navigation) must work unchanged
- Build process performance and output should remain the same

**Scope:**
All files that do NOT contain invalid UTF-8 characters should be completely unaffected by this fix. This includes:
- Other TSX/JSX files with valid UTF-8 encoding
- CSS files, configuration files, and other assets
- Runtime behavior of the application in the browser
- API endpoints and server-side functionality

## Hypothesized Root Cause

Based on the bug description and file analysis, the most likely issues are:

1. **Copy-Paste Encoding Issues**: The invalid characters likely originated from copying text from sources with different character encodings (Windows-1252, Latin-1) and pasting into UTF-8 files
   - The `�` character is a typical replacement character when encoding conversion fails
   - This commonly happens when copying from Word documents or web browsers

2. **Editor Encoding Mismatch**: The text editor may have temporarily used a different encoding when these characters were typed or pasted

3. **Font/Display Character Issues**: Some characters may have been entered as special Unicode points that don't have valid UTF-8 representations

4. **File Transfer Corruption**: Files may have been corrupted during transfer between systems with different default encodings

## Correctness Properties

Property 1: Bug Condition - UTF-8 Encoding Compliance

_For any_ TSX file that contains invalid UTF-8 byte sequences (isBugCondition returns true), the fixed files SHALL contain only valid UTF-8 characters, allowing the Next.js compiler to process them successfully without encoding errors.

**Validates: Requirements 2.1, 2.2, 2.3**

Property 2: Preservation - Visual and Functional Equivalence

_For any_ file modification made during the UTF-8 fix, the rendered output and component functionality SHALL remain visually and behaviorally identical to the original, preserving all user-facing features and interactions.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

## Fix Implementation

### Changes Required

Based on our analysis of the invalid UTF-8 characters found:

**File**: `app/(main)/keranjang/CartItemRow.tsx`

**Line 88**: Comment with invalid character
**Specific Changes**:
1. **Replace Invalid Character in Comment**: Change `{/* Subtotal � desktop only */}` to `{/* Subtotal - desktop only */}`
   - Replace the invalid UTF-8 character with a standard ASCII hyphen (-)
   - Maintain the semantic meaning of the comment

**File**: `app/(main)/page.tsx`

**Line 108**: JSX option element with invalid character
**Line 152**: Link text with invalid character at start

**Specific Changes**:
2. **Replace Invalid Character in Option Text**: Change `<option value="nama-asc">Nama A�Z</option>` to `<option value="nama-asc">Nama A–Z</option>`
   - Replace the invalid UTF-8 character with a proper Unicode en dash (–) or em dash (-) for "A to Z"
   - Maintain the sorting option meaning

3. **Replace Invalid Character in Link Text**: Change `? Kembali ke Beranda` to `← Kembali ke Beranda`
   - Replace the invalid UTF-8 character with a proper Unicode left arrow (←) for navigation
   - Maintain the "back to home" navigation semantics

4. **File Encoding Verification**: Ensure all files are saved with UTF-8 encoding
   - Set editor/IDE to use UTF-8 encoding for all TypeScript/React files
   - Verify no Byte Order Mark (BOM) is added that could cause issues

5. **Character Set Validation**: Scan for any other potential invalid UTF-8 sequences
   - Use UTF-8 validation tools to ensure comprehensive coverage
   - Check for zero-width characters or other problematic Unicode points

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Attempt to build the application with the unfixed files and capture the specific UTF-8 encoding errors. Run these tests on the UNFIXED code to observe failures and understand the exact error patterns.

**Test Cases**:
1. **Build Process Test**: Run `npm run build` on unfixed code (will fail with UTF-8 errors)
2. **File Encoding Detection**: Use UTF-8 validation tools on CartItemRow.tsx (will detect invalid bytes)
3. **File Encoding Detection**: Use UTF-8 validation tools on page.tsx (will detect invalid bytes)
4. **Development Server Test**: Try starting dev server with unfixed files (may fail or show warnings)

**Expected Counterexamples**:
- Next.js build process fails with "stream did not contain valid UTF-8" errors
- Possible causes: invalid byte sequences, encoding mismatch, character corruption

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL file WHERE isBugCondition(file) DO
  result := buildProcess_fixed(file)
  ASSERT expectedBehavior(result) // successful compilation
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL file WHERE NOT isBugCondition(file) DO
  ASSERT buildProcess_original(file) = buildProcess_fixed(file)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss  
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for valid UTF-8 files and user interactions, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Component Render Preservation**: Verify CartItemRow component renders identically before and after fix
2. **Navigation Link Preservation**: Verify "Kembali ke Beranda" link functions identically  
3. **Sort Option Preservation**: Verify "Nama A-Z" option works identically
4. **Build Output Preservation**: Verify built application has identical functionality

### Unit Tests

- Test that CartItemRow component renders without errors after UTF-8 fix
- Test that sorting dropdown displays correct text after character replacement
- Test that navigation links function correctly after character replacement
- Test that build process completes successfully with all files

### Property-Based Tests

- Generate random component props and verify CartItemRow renders consistently before/after fix
- Generate random navigation states and verify link behavior is preserved
- Test that all text content displays correctly across many browser/device scenarios

### Integration Tests

- Test full application build process with fixed UTF-8 characters
- Test user interactions with cart functionality to ensure no regressions
- Test navigation flow from product pages back to homepage
- Test sorting functionality in product catalog to ensure dropdown works correctly