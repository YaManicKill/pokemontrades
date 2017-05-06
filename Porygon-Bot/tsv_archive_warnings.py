from datetime import timedelta
from datetime import datetime
import OAuth2Util
import praw
import urllib
import re

r = praw.Reddit(user_agent = 'Porygon Archive Warnings')
r.config.api_request_delay = 1.01
o = OAuth2Util.OAuth2Util(r)

REDDIT_ARCHIVE_AGE = timedelta(days = 180) # The age at which a reddit post gets archived
SCRIPT_PERIOD = timedelta(days = 1) # The amount of time that passes between each time script is run
TIMESTAMP_OFFSET = timedelta(hours = 8) # There's a reddit bug where all timestamps in search queries are offset by 8 hours.
REDDIT_MAX_COMMENT_LENGTH = 10000

archive_point = datetime.utcnow() - REDDIT_ARCHIVE_AGE
epoch = datetime.utcfromtimestamp(0)
lower_bound_timestamp = int((archive_point - SCRIPT_PERIOD * 2 + TIMESTAMP_OFFSET - epoch).total_seconds())
upper_bound_timestamp = int((archive_point + SCRIPT_PERIOD + TIMESTAMP_OFFSET - epoch).total_seconds())
search_query = '(and timestamp:' + str(lower_bound_timestamp) + '..' + str(upper_bound_timestamp) + " (or flair_css_class:'sv6' flair_css_class:'sv7'))"
closed = []
warned = []
for result in r.search(search_query, subreddit = 'SVExchange', sort = 'new', syntax = 'cloudsearch', limit = None):
	if not result.over_18:
		if result.archived:
			result.mark_as_nsfw()
			closed.append(result.id)
		else:
			first_block = """Hello,

You are receiving this message because this thread will automatically be archived by Reddit in less than a day.

All threads get archived by Reddit six months after they are created, which prevents anyone from commenting on them. \
If you would like to continue hatching eggs for the community, you will need to \
**[repost your TSV thread](/r/SVExchange/submit?selftext=true&title="""

			first_block += urllib.quote(result.title.encode('utf-8')) + '&text='
			last_block = """)**.

*This comment was posted automatically by a bot. If you have any questions/concerns, please \
[message the moderators](/message/compose?to=%2Fr%2FSVExchange).*"""

			new_post_body = re.sub(r'\[tsv\](?!\((\w+:)?\/)', '[tsv6]', result.selftext.encode('utf-8'), flags=re.IGNORECASE)
			new_post_body = urllib.quote(new_post_body).replace(')', '\\)').replace('*', '\\*').strip()
			archived_link = urllib.quote(('\n\n[Old thread (archived)](' + result.url + ')').encode('utf-8'))
			if len(first_block + new_post_body + archived_link + last_block) <= REDDIT_MAX_COMMENT_LENGTH:
				response = first_block + new_post_body + archived_link + last_block
			elif len(first_block + new_post_body + last_block) <= REDDIT_MAX_COMMENT_LENGTH:
				response = first_block + new_post_body + last_block
			else:
				response = first_block + '%5Btsv%5D' + archived_link + last_block
			result.add_comment(response).distinguish()
			warned.append(result.id)
print 'Closed the following archived threads: ' + ', '.join(closed)
print 'Left archive warnings on following threads: ' + ', '.join(warned)
