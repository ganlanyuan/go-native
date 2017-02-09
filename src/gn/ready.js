export function ready(fn) {
  // Sanity check
  if ( typeof fn !== "function" ) { return; }

  // If document is already loaded, run method
  if ( document.readyState === "complete"  ) {
    return fn();
  }

  // Otherwise, wait until document is loaded
  document.addEventListener( "DOMContentLoaded", fn, false );
}