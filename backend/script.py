from nhlpy.nhl_client import NHLClient
import json

def main():
    client = NHLClient(verbose=True)
    teams = client.teams.teams_info()
    
    # Optionally, you can transform the data if needed.
    # For instance, if you want to use the "common_name" property as the key:
    teams_list = teams  # assuming teams is already a list of team objects

    # Write to a JSON file (or generate a TS module below)
    with open("teams.json", "w") as f:
        json.dump(teams_list, f, indent=2)
    
    # Alternatively, if you want to output a TypeScript module:
    ts_content = "export const teamsList = " + json.dumps(teams_list, indent=2) + ";"
    with open("teams.ts", "w") as f:
        f.write(ts_content)

if __name__ == "__main__":
    main()
