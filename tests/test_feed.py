from scout.main import feed_document

def test_feed_document_schema():
    repo = {'full_name': 'apache/hbase', 'html_url': 'https://github.com/apache/hbase', 'description': 'database', 'stargazers_count': 123, 'language': 'Java'}
    selected = [(85.34, {'repo': repo, 'categories': ['systems']}, {'summary': '分布式数据库', 'why': '可靠性', 'build_idea': '故障注入'})]
    feed = feed_document(selected, '2026-11-03')
    assert feed['schema_version'] == 1
    assert feed['repos'][0]['score'] == 85.3
    assert feed['repos'][0]['build_idea'] == '故障注入'
