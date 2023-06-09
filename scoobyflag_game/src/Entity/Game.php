<?php

namespace App\Entity;

use App\Repository\GameRepository;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: GameRepository::class)]
class Game
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['Game:read'])]
    private ?int $id = null;
    
    #[ORM\Column(length: 255)]
    #[Groups(['Game:read', "Info:read"])]
    private ?string $name = null;
    
    #[ORM\Column(length: 255)]
    #[Groups(['Game:read', "Info:read"])]
    private ?string $mode = null;
    
    #[ORM\Column(nullable:true)]
    #[Groups(['Game:read', "Info:read"])]
    private ?\DateTimeImmutable $startAt = null;
    
    #[ORM\Column]
    #[Groups(['Game:read', "Info:read"])]
    private ?int $limitTime = null;
    
    // #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    // private ?User $gameMaster = null;
    
    #[ORM\OneToMany(mappedBy: 'game', targetEntity: GameInterdictionLocalisation::class)]
    #[Groups(['Game:read'])]
    private Collection $gameInterdictionLocalisations;
    
    #[ORM\OneToMany(mappedBy: 'game', targetEntity: GameLocation::class)]
    #[Groups(['Game:read'])]
    private Collection $gameLocations;
    
    #[ORM\OneToMany(mappedBy: 'game', targetEntity: Objective::class)]
    #[Groups(['Game:read'])]
    private Collection $objectives;
    
    #[ORM\OneToMany(mappedBy: 'game', targetEntity: Item::class)]
    #[Groups(['Game:read'])]
    private Collection $items;
    
    #[ORM\OneToMany(mappedBy: 'game', targetEntity: Team::class)]
    #[Groups(['Game:read'])]
    private Collection $teams;

    public function __construct()
    {
        $this->gameInterdictionLocalisations = new ArrayCollection();
        $this->gameLocations = new ArrayCollection();
        $this->objectives = new ArrayCollection();
        $this->items = new ArrayCollection();
        $this->teams = new ArrayCollection();
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

    public function getMode(): ?string
    {
        return $this->mode;
    }

    public function setMode(string $mode): self
    {
        $this->mode = $mode;

        return $this;
    }

    public function getStartAt(): ?\DateTimeImmutable
    {
        return $this->startAt;
    }

    public function setStartAt(?DateTimeImmutable $startAt): self
    {
        $this->startAt = $startAt;

        return $this;
    }

    public function getLimitTime(): ?int
    {
        return $this->limitTime;
    }

    public function setLimitTime(int $limitTime): self
    {
        $this->limitTime = $limitTime;

        return $this;
    }

    // public function getGameMaster(): ?User
    // {
    //     return $this->gameMaster;
    // }

    // public function setGameMaster(?User $gameMaster): self
    // {
    //     $this->gameMaster = $gameMaster;

    //     return $this;
    // }

    /**
     * @return Collection<int, GameInterdictionLocalisation>
     */
    public function getGameInterdictionLocalisations(): Collection
    {
        return $this->gameInterdictionLocalisations;
    }

    public function addGameInterdictionLocalisation(GameInterdictionLocalisation $gameInterdictionLocalisation): self
    {
        if (!$this->gameInterdictionLocalisations->contains($gameInterdictionLocalisation)) {
            $this->gameInterdictionLocalisations->add($gameInterdictionLocalisation);
            $gameInterdictionLocalisation->setGame($this);
        }

        return $this;
    }

    public function removeGameInterdictionLocalisation(GameInterdictionLocalisation $gameInterdictionLocalisation): self
    {
        if ($this->gameInterdictionLocalisations->removeElement($gameInterdictionLocalisation)) {
            // set the owning side to null (unless already changed)
            if ($gameInterdictionLocalisation->getGame() === $this) {
                $gameInterdictionLocalisation->setGame(null);
            }
        }

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
            $gameLocation->setGame($this);
        }

        return $this;
    }

    public function removeGameLocation(GameLocation $gameLocation): self
    {
        if ($this->gameLocations->removeElement($gameLocation)) {
            // set the owning side to null (unless already changed)
            if ($gameLocation->getGame() === $this) {
                $gameLocation->setGame(null);
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
            $objective->setGame($this);
        }

        return $this;
    }

    public function removeObjective(Objective $objective): self
    {
        if ($this->objectives->removeElement($objective)) {
            // set the owning side to null (unless already changed)
            if ($objective->getGame() === $this) {
                $objective->setGame(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Item>
     */
    public function getItems(): Collection
    {
        return $this->items;
    }

    public function addItem(Item $item): self
    {
        if (!$this->items->contains($item)) {
            $this->items->add($item);
            $item->setGame($this);
        }

        return $this;
    }

    public function removeItem(Item $item): self
    {
        if ($this->items->removeElement($item)) {
            // set the owning side to null (unless already changed)
            if ($item->getGame() === $this) {
                $item->setGame(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Team>
     */
    public function getTeams(): Collection
    {
        return $this->teams;
    }

    public function addTeam(Team $team): self
    {
        if (!$this->teams->contains($team)) {
            $this->teams->add($team);
            $team->setGame($this);
        }

        return $this;
    }

    public function removeTeam(Team $team): self
    {
        if ($this->teams->removeElement($team)) {
            // set the owning side to null (unless already changed)
            if ($team->getGame() === $this) {
                $team->setGame(null);
            }
        }

        return $this;
    }
}
