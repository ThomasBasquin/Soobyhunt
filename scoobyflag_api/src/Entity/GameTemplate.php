<?php

namespace App\Entity;

use App\Repository\GameTemplateRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: GameTemplateRepository::class)]
class GameTemplate
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['GameTemplate:read'])]
    private ?int $id = null;
    
    #[ORM\ManyToOne(inversedBy: 'gameTemplates')]
    #[Groups(['GameTemplate:read'])]
    private ?User $gameMaster = null;

    #[ORM\Column]
    private array $json = [];

    #[ORM\Column]
    private ?bool $isActive = null;
    
    public function __construct()
    {
        $this->isActive = true;
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getJson(): array
    {
        return $this->json;
    }

    public function setJson(array $json): self
    {
        $this->json = $json;

        return $this;
    }

    public function isIsActive(): ?bool
    {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): self
    {
        $this->isActive = $isActive;

        return $this;
    }


}
