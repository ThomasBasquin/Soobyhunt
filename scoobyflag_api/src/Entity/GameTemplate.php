<?php

namespace App\Entity;

use App\Repository\GameTemplateRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: GameTemplateRepository::class)]
class GameTemplate
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\ManyToOne(inversedBy: 'gameTemplates')]
    private ?User $gameMaster = null;

    #[ORM\OneToMany(mappedBy: 'gameTemplate', targetEntity: GameLocation::class)]
    private Collection $gameLocations;

    #[ORM\OneToMany(mappedBy: 'gameTemplate', targetEntity: GameZone::class)]
    private Collection $gameZones;

    #[ORM\OneToMany(mappedBy: 'gameTemplate', targetEntity: Objective::class)]
    private Collection $objectives;

    #[ORM\OneToMany(mappedBy: 'gameTemplate', targetEntity: Game::class)]
    private Collection $games;

    public function __construct()
    {
        $this->gameLocations = new ArrayCollection();
        $this->gameZones = new ArrayCollection();
        $this->objectives = new ArrayCollection();
        $this->games = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getGameMaster(): ?User
    {
        return $this->gameMaster;
    }

    public function setGameMaster(?User $gameMaster): self
    {
        $this->gameMaster = $gameMaster;

        return $this;
    }

    /**
     * @return Collection<int, GameLocation>
     */
    public function getGameLocations(): Collection
    {
        return $this->gameLocations;
    }

    public function addGameLocation(GameLocation $gameLocation): self
    {
        if (!$this->gameLocations->contains($gameLocation)) {
            $this->gameLocations->add($gameLocation);
            $gameLocation->setGameTemplate($this);
        }

        return $this;
    }

    public function removeGameLocation(GameLocation $gameLocation): self
    {
        if ($this->gameLocations->removeElement($gameLocation)) {
            // set the owning side to null (unless already changed)
            if ($gameLocation->getGameTemplate() === $this) {
                $gameLocation->setGameTemplate(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, GameZone>
     */
    public function getGameZones(): Collection
    {
        return $this->gameZones;
    }

    public function addGameZone(GameZone $gameZone): self
    {
        if (!$this->gameZones->contains($gameZone)) {
            $this->gameZones->add($gameZone);
            $gameZone->setGameTemplate($this);
        }

        return $this;
    }

    public function removeGameZone(GameZone $gameZone): self
    {
        if ($this->gameZones->removeElement($gameZone)) {
            // set the owning side to null (unless already changed)
            if ($gameZone->getGameTemplate() === $this) {
                $gameZone->setGameTemplate(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Objective>
     */
    public function getObjectives(): Collection
    {
        return $this->objectives;
    }

    public function addObjective(Objective $objective): self
    {
        if (!$this->objectives->contains($objective)) {
            $this->objectives->add($objective);
            $objective->setGameTemplate($this);
        }

        return $this;
    }

    public function removeObjective(Objective $objective): self
    {
        if ($this->objectives->removeElement($objective)) {
            // set the owning side to null (unless already changed)
            if ($objective->getGameTemplate() === $this) {
                $objective->setGameTemplate(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Game>
     */
    public function getGames(): Collection
    {
        return $this->games;
    }

    public function addGame(Game $game): self
    {
        if (!$this->games->contains($game)) {
            $this->games->add($game);
            $game->setGameTemplate($this);
        }

        return $this;
    }

    public function removeGame(Game $game): self
    {
        if ($this->games->removeElement($game)) {
            // set the owning side to null (unless already changed)
            if ($game->getGameTemplate() === $this) {
                $game->setGameTemplate(null);
            }
        }

        return $this;
    }
}
