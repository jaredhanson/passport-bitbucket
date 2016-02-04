/**
 * Parse profile.
 *
 * References:
 *   - https://confluence.atlassian.com/bitbucket/user-endpoint-2-0-744527199.html
 *
 * @param {object|string} json
 * @return {object}
 * @api public
 */
exports.parse = function(json) {
  if ('string' == typeof json) {
    json = JSON.parse(json);
  }
  
  var profile = {};
  profile.id = json.uuid;
  profile.username = json.username;
  profile.displayName = json.display_name;
  
  return profile;
};
