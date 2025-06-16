import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Avatar,
} from "@mui/material";
import axios from "axios";

interface Player {
  player_id: string;
  full_name: string;
  team: string;
  position: string;
  jersey: string;
  headshot_url: string;
}

interface PassingLeader {
  player: Player;
  total_passing_yards: number;
  total_passing_tds: number;
  total_attempts: number;
  total_completions: number;
  total_interceptions: number;
  games_played: number;
}

interface PassingLeadersResponse {
  leaders: PassingLeader[];
}

const NflPassingLeaders: React.FC = () => {
  const [leaders, setLeaders] = useState<PassingLeader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const response = await axios.get<PassingLeadersResponse>(
          "http://localhost:8000/nfl/players/leaders/passing"
        );
        setLeaders(response.data.leaders);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch passing leaders");
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        NFL Passing Leaders
      </Typography>
      <Grid container spacing={3}>
        {leaders.map((leader, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={leader.player.player_id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: 3,
                },
              }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    src={leader.player.headshot_url}
                    alt={leader.player.full_name}
                    sx={{ width: 80, height: 80, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h6" component="div">
                      {leader.player.full_name}
                    </Typography>
                    <Typography color="text.secondary">
                      {leader.player.team} • #{leader.player.jersey}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h5" color="primary" gutterBottom>
                    {leader.total_passing_yards.toLocaleString()} Yards
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Touchdowns
                      </Typography>
                      <Typography variant="body1">
                        {leader.total_passing_tds}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Interceptions
                      </Typography>
                      <Typography variant="body1">
                        {leader.total_interceptions}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Completion %
                      </Typography>
                      <Typography variant="body1">
                        {(
                          (leader.total_completions / leader.total_attempts) *
                          100
                        ).toFixed(1)}
                        %
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Games Played
                      </Typography>
                      <Typography variant="body1">
                        {leader.games_played}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default NflPassingLeaders;
