<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['User:read'])]
    private ?int $id = null;
    
    #[ORM\Column]
    #[Groups(['User:read'])]
    private ?int $idOrigin = null;
    
    #[ORM\Column]
    #[Groups(['User:read'])]
    private ?int $objectiveCaptured = null;
    
    #[ORM\Column]
    #[Groups(['User:read'])]
    private ?int $itemGet = null;
    
    #[ORM\Column]
    #[Groups(['User:read'])]
    private ?int $itemUsed = null;
    
    #[ORM\Column]
    private ?float $distanceWalk = null;
    
    #[ORM\OneToMany(mappedBy: 'capturedBy', targetEntity: ObjectiveUser::class)]
    private Collection $objectiveUsers;
    
    #[ORM\OneToMany(mappedBy: 'getBy', targetEntity: ItemUser::class)]
    private Collection $itemUser;
    
    #[ORM\ManyToOne(inversedBy: 'players')]
    private ?Team $team = null;
    
    #[ORM\Column(nullable: true)]
    #[Groups(['User:read'])]
    private ?float $latitude = null;
    
    #[ORM\Column(nullable: true)]
    #[Groups(['User:read'])]
    private ?float $longitude = null;

    #[ORM\Column]
    private ?bool $isReady = null;

    #[ORM\Column(length: 255)]
    private ?string $pseudo = null;

    
    public function __construct()
    {
        $this->isReady = false;
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

    public function getLatitude(): ?float
    {
        return $this->latitude;
    }

    public function setLatitude(?float $latitude): self
    {
        $this->latitude = $latitude;

        return $this;
    }

    public function getLongitude(): ?float
    {
        return $this->longitude;
    }

    public function setLongitude(?float $longitude): self
    {
        $this->longitude = $longitude;

        return $this;
    }

    public function isIsReady(): ?bool
    {
        return $this->isReady;
    }

    public function setIsReady(bool $isReady): self
    {
        $this->isReady = $isReady;

        return $this;
    }

    public function getPseudo(): ?string
    {
        return $this->pseudo;
    }

    public function setPseudo(string $pseudo): self
    {
        $this->pseudo = $pseudo;

        return $this;
    }
}
