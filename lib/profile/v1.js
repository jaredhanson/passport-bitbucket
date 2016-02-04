/**
 * Parse profile.
 *
 * References:
 *   - https://confluence.atlassian.com/bitbucket/user-endpoint-296092264.html
 *   - https://confluence.atlassian.com/bitbucket/users-endpoint-1-0-296092732.html
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
  profile.username = json.user.username;
  profile.displayName = json.user.first_name + ' ' + json.user.last_name;
  profile.name = { familyName: json.user.last_name,
                   givenName: json.user.first_name };
  
  return profile;
};
