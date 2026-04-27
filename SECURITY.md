# Security Policy

## Security Fixes Applied

This extension has undergone a comprehensive security audit and the following critical vulnerabilities have been addressed:

### 1. Remote Code Execution (CRITICAL) - Fixed ✅
**Issue**: The extension previously used `eval()` to parse JavaScript objects in two features:
- `JsToJson.tsx` 
- `JsToTypeScript.tsx`

**Risk**: This allowed arbitrary code execution from user input, which could lead to complete system compromise.

**Fix**: Replaced `eval()` with a safe parser that uses regex-based transformation and `JSON.parse()`. The new implementation:
- Only accepts object literals enclosed in `{}`
- Converts JavaScript object notation to valid JSON
- Validates input before parsing
- Throws descriptive errors for invalid syntax

### 2. Cross-Site Scripting (XSS) - Fixed ✅
**Issue**: The HTML template in `src/index.ts` injected unescaped JSON directly into a script tag.

**Risk**: Malicious content could execute arbitrary JavaScript in the webview context.

**Fix**: 
- Added HTML escaping function for all user-controlled data
- Implemented proper encoding using `encodeURIComponent` and `decodeURIComponent`
- Added Content Security Policy (CSP) headers to the webview
- Restricted script sources to only trusted URIs

### 3. Vulnerable Dependencies - Fixed ✅
**Issue**: Multiple npm packages had known security vulnerabilities:
- `@walmartlabs/json-to-simple-graphql-schema` (HIGH) - Prototype pollution via lodash.set
- `vscode` package (deprecated) - Multiple transitive vulnerabilities
- 18 total vulnerabilities (3 critical, 5 high, 5 moderate, 5 low)

**Fix**:
- Removed vulnerable `@walmartlabs/json-to-simple-graphql-schema` package
- Implemented custom, secure JSON-to-GraphQL converter
- Removed deprecated `vscode` package
- Updated all dependencies to latest secure versions
- **Result**: 0 vulnerabilities remaining

## Current Security Status

✅ **All Critical Vulnerabilities Resolved**
✅ **Zero Known Vulnerabilities** (as of last audit)
✅ **Content Security Policy Implemented**
✅ **Input Validation & Sanitization**
✅ **Safe Parsing Methods Only**

## Security Best Practices

This extension follows these security principles:

1. **No eval() or Function() constructors** - All code execution is controlled
2. **Input validation** - All user input is validated before processing
3. **Output encoding** - All dynamic content is properly escaped
4. **CSP headers** - Webview has strict Content Security Policy
5. **Minimal dependencies** - Only necessary, well-maintained packages
6. **Regular audits** - Dependencies are regularly checked for vulnerabilities

## Reporting Security Issues

If you discover a security vulnerability, please report it by:

1. **DO NOT** open a public GitHub issue
2. Email the maintainer directly at the repository owner's contact
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work to address the issue promptly.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.0.2+  | ✅ Yes (Secure)    |
| < 0.0.2 | ❌ No (Vulnerable) |

## Security Update History

- **2026-02-13**: Comprehensive security audit and fixes
  - Fixed RCE vulnerability (eval injection)
  - Fixed XSS vulnerability (unescaped JSON)
  - Removed all vulnerable dependencies
  - Implemented CSP headers
  - Added input validation

