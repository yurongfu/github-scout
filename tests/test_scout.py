from datetime import datetime, timezone
from scout.main import trim_history, discord_payload, select_digest


def fake_candidate(name, cats):
    return {'repo': {'full_name': name, 'html_url': f'https://github.com/{name}', 'stargazers_count': 42, 'language': 'Python', 'description': 'An AI agent', 'created_at': '2026-10-30T00:00:00Z'}, 'categories': cats}


def test_history_expiry():
    h = {'sent': {'old/repo': '2020-01-01T00:00:00+00:00', 'new/repo': '2026-11-01T00:00:00+00:00'}}
    trim_history(h, 120, datetime(2026, 11, 2, tzinfo=timezone.utc))
    assert list(h['sent']) == ['new/repo']


def test_selection_and_payload():
    cfg = {'max_repos': 5, 'minimum_score': 20, 'categories': {'agents': {'weight': 35}}}
    c = fake_candidate('example/agent', ['agents'])
    picked = select_digest([c], {}, cfg, datetime(2026, 11, 2, tzinfo=timezone.utc))
    assert len(picked) == 1
    p = discord_payload(picked, '2026-11-02')
    assert p['embeds'][0]['url'] == 'https://github.com/example/agent'
    assert p['allowed_mentions'] == {'parse': []}
