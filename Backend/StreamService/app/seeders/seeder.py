from app.seeders.stream_file_seeder import generate_stream_file_seed

def generate_all_seeds(session):
    print("StreamFile seeding")
    generate_stream_file_seed(session)
