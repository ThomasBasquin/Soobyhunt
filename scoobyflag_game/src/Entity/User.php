<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $idOrigin = null;

    #[ORM\Column]
    private ?int $objectiveCaptured = null;

    #[ORM\Column]
    private ?int $itemGet = null;

    #[ORM\Column]
    private ?int $itemUsed = null;

    #[ORM\Column]
    private ?float $distanceWalk = null;

    #[ORM\OneToMany(mappedBy: 'capturedBy', targetEntity: ObjectiveUser::class)]
    private Collection $objectiveUsers;

    #[ORM\OneToMany(mappedBy: 'getBy', targetEntity: ItemUser::class)]
    private Collection $itemUser;

    #[ORM\ManyToOne(inversedBy: 'players')]
    private ?Team $team = null;

    
    public function __construct()
    {
        $this->itemGet = 0;
        $this->distanceWalk = 0;
        $this->itemUsed = 0;
        $this->objectiveUsers = new ArrayCollection();
        $this->itemUser = new ArrayCollection();
    }
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdOrigin(): ?int
    {
        return $this->idOrigin;
    }

    public function setIdOrigin(int $idOrigin): self
    {
        $this->idOrigin = $idOrigin;

        return $this;
    }

    public function getObjectiveCaptured(): ?int
    {
        return $this->objectiveCaptured;
    }

    public function setObjectiveCaptured(int $objectiveCaptured): self
    {
        $this->objectiveCaptured = $objectiveCaptured;

        return $this;
    }

    public function getItemGet(): ?int
    {
        return $this->itemGet;
    }

    public function setItemGet(int $itemGet): self
    {
        $this->itemGet = $itemGet;

        return $this;
    }

    public function getItemUsed(): ?int
    {
        return $this->itemUsed;
    }

    public function setItemUsed(int $itemUsed): self
    {
        $this->itemUsed = $itemUsed;

        return $this;
    }

    public function getDistanceWalk(): ?float
    {
        return $this->distanceWalk;
    }

    public function setDistanceWalk(float $distanceWalk): self
    {
        $this->distanceWalk = $distanceWalk;

        return $this;
    }

    /**
     * @return Collection<int, ObjectiveUser>
     */
    public function getObjectiveUsers(): Collection
    {
        return $this->objectiveUsers;
    }

    public function addObjectiveUser(ObjectiveUser $objectiveUser): self
    {
        if (!$this->objectiveUsers->contains($objectiveUser)) {
            $this->objectiveUsers->add($objectiveUser);
            $objectiveUser->setCapturedBy($this);
        }

        return $this;
    }

    public function removeObjectiveUser(ObjectiveUser $objectiveUser): self
    {
        if ($this->objectiveUsers->removeElement($objectiveUser)) {
            // set the owning side to null (unless already changed)
            if ($objectiveUser->getCapturedBy() === $this) {
                $objectiveUser->setCapturedBy(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ItemUser>
     */
    public function getItemUser(): Collection
    {
        return $this->itemUser;
    }

    public function addItemUser(ItemUser $itemUser): self
    {
        if (!$this->itemUser->contains($itemUser)) {
            $this->itemUser->add($itemUser);
            $itemUser->setGetBy($this);
        }

        return $this;
    }

    public function removeItemUser(ItemUser $itemUser): self
    {
        if ($this->itemUser->removeElement($itemUser)) {
            // set the owning side to null (unless already changed)
            if ($itemUser->getGetBy() === $this) {
                $itemUser->setGetBy(null);
            }
        }

        return $this;
    }

    public function getTeam(): ?Team
    {
        return $this->team;
    }

    public function setTeam(?Team $team): self
    {
        $this->team = $team;

        return $this;
    }
}
