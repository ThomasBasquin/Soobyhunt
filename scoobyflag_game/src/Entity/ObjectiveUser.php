<?php

namespace App\Entity;

use App\Repository\ObjectiveUserRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ObjectiveUserRepository::class)]
class ObjectiveUser
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    private ?Objective $objective = null;

    #[ORM\ManyToOne(inversedBy: 'objectiveUsers')]
    private ?User $capturedBy = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getObjective(): ?Objective
    {
        return $this->objective;
    }

    public function setObjective(?Objective $objective): self
    {
        $this->objective = $objective;

        return $this;
    }

    public function getCapturedBy(): ?User
    {
        return $this->capturedBy;
    }

    public function setCapturedBy(?User $capturedBy): self
    {
        $this->capturedBy = $capturedBy;

        return $this;
    }
}
