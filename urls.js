// /**
//  * Search for matches
//  * @param  {String} query The term to search for
//  */
// function search (query) {

// 	// ...

// 	// Display the results
// 	showResults(results);

// 	// Update the URL
// 	updateURL(query);

// }
// /**
//  * Update the URL with a query string for the search string
//  * @param  {String} query The search query
//  */
// function updateURL (query) {

// 	// Create the properties
// 	let state = history.state;
// 	let title = document.title;
// 	let url = window.location.origin + window.location.pathname + '?s=' + encodeURI(query);

// 	// Update the URL
// 	history.pushState(state, title, url);
// }