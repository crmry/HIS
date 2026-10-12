#!/usr/bin/env bash
# ==============================================================================
# sync_agent_skills.sh - Synchronize Workspace Skills to Global Antigravity Config
# ==============================================================================
# Usage:
#   bash scripts/sync_agent_skills.sh
#
# Description:
#   Copies or updates all repository-defined skills from .agents/skills/ into the
#   user's global Antigravity configuration directory (~/.gemini/config/skills/).
#   This ensures the skills remain accessible across all projects and devices.
# ==============================================================================

set -euo pipefail

WORKSPACE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKSPACE_SKILLS="$WORKSPACE_ROOT/.agents/skills"
GLOBAL_SKILLS_DIR="$HOME/.gemini/config/skills"

echo "=== Antigravity Skill Sync Tool ==="
echo "Workspace root: $WORKSPACE_ROOT"

if [ ! -d "$WORKSPACE_SKILLS" ]; then
  echo "Error: No workspace skills found at $WORKSPACE_SKILLS" >&2
  exit 1
fi

mkdir -p "$GLOBAL_SKILLS_DIR"

for skill_path in "$WORKSPACE_SKILLS"/*; do
  if [ -d "$skill_path" ]; then
    skill_name="$(basename "$skill_path")"
    target_path="$GLOBAL_SKILLS_DIR/$skill_name"
    echo "Synchronizing skill: $skill_name -> $target_path"
    mkdir -p "$target_path"
    cp -R "$skill_path"/* "$target_path/"
  fi
done

echo "✅ All workspace skills successfully synced to $GLOBAL_SKILLS_DIR"
