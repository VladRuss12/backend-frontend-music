"""Removed serach vectrors for whoosh, instead added tsvector

Revision ID: c0d9477b772f
Revises: 094be7efa36c
Create Date: 2025-05-31 00:13:50.691090

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'c0d9477b772f'
down_revision = '094be7efa36c'
branch_labels = None
depends_on = None


def upgrade():

    with op.batch_alter_table('playlists', schema=None) as batch_op:
        batch_op.add_column(sa.Column('search_vector', postgresql.TSVECTOR(), nullable=True))

    with op.batch_alter_table('tracks', schema=None) as batch_op:
        batch_op.add_column(sa.Column('search_vector', postgresql.TSVECTOR(), nullable=True))

    with op.batch_alter_table('performers', schema=None) as batch_op:
        batch_op.add_column(sa.Column('search_vector', postgresql.TSVECTOR(), nullable=True))


    # Performer
    op.execute("""
        UPDATE performers SET search_vector = to_tsvector('russian', coalesce(name,'') || ' ' || coalesce(genre,''));
        CREATE INDEX performers_search_vector_idx ON performers USING gin(search_vector);
        CREATE TRIGGER performers_search_vector_update BEFORE INSERT OR UPDATE
            ON performers FOR EACH ROW EXECUTE FUNCTION
            tsvector_update_trigger(search_vector, 'pg_catalog.russian', name, genre);
    """)
    # Track
    op.execute("""
        UPDATE tracks SET search_vector = to_tsvector('russian', coalesce(title,'') || ' ' || coalesce(genre,''));
        CREATE INDEX tracks_search_vector_idx ON tracks USING gin(search_vector);
        CREATE TRIGGER tracks_search_vector_update BEFORE INSERT OR UPDATE
            ON tracks FOR EACH ROW EXECUTE FUNCTION
            tsvector_update_trigger(search_vector, 'pg_catalog.russian', title, genre);
    """)
    # Playlist
    op.execute("""
        UPDATE playlists SET search_vector = to_tsvector('russian', coalesce(name,''));
        CREATE INDEX playlists_search_vector_idx ON playlists USING gin(search_vector);
        CREATE TRIGGER playlists_search_vector_update BEFORE INSERT OR UPDATE
            ON playlists FOR EACH ROW EXECUTE FUNCTION
            tsvector_update_trigger(search_vector, 'pg_catalog.russian', name);
    """)

def downgrade():
    op.execute("""
        DROP TRIGGER IF EXISTS performers_search_vector_update ON performers;
        DROP INDEX IF EXISTS performers_search_vector_idx;
    """)
    op.execute("""
        DROP TRIGGER IF EXISTS tracks_search_vector_update ON tracks;
        DROP INDEX IF EXISTS tracks_search_vector_idx;
    """)
    op.execute("""
        DROP TRIGGER IF EXISTS playlists_search_vector_update ON playlists;
        DROP INDEX IF EXISTS playlists_search_vector_idx;
    """)


    with op.batch_alter_table('tracks', schema=None) as batch_op:
        batch_op.drop_column('search_vector')

    with op.batch_alter_table('playlists', schema=None) as batch_op:
        batch_op.drop_column('search_vector')

    with op.batch_alter_table('performers', schema=None) as batch_op:
        batch_op.drop_column('search_vector')
