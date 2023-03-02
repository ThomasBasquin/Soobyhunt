<?php

namespace App\Entity;

use App\Repository\TeamRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: TeamRepository::class)]
class Team
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["Team:read"])]
    private ?int $id = null;
    
    #[ORM\Column(length: 255)]
    #[Groups(["Team:read"])]
    private ?string $name = null;
    
    #[ORM\Column]
    #[Groups(["Team:read"])]
    private ?int $playerMax = null;
    
    #[ORM\ManyToOne(inversedBy: 'teams')]
    private ?GameTemplate $gameTemplate = null;

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

    public function getPlayerMax(): ?int
    {
        return $this->playerMax;
    }

    public function setPlayerMax(int $playerMax): self
    {
        $this->playerMax = $playerMax;

        return $this;
    }

    public function getGameTemplate(): ?GameTemplate
    {
        return $this->gameTemplate;
    }

    public function setGameTemplate(?GameTemplate $gameTemplate): self
    {
        $this->gameTemplate = $gameTemplate;

        return $this;
    }
}
