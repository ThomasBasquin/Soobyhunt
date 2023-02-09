<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use App\Repository\ItemRepository;
use App\Entity\Item;
use App\Entity\ItemType;
use App\Repository\ItemTypeRepository;
use Symfony\Component\Serializer\SerializerInterface;

class ItemService
{
    public EntityManagerInterface $em;
    private ItemRepository $itemRepository;
    private ItemTypeRepository $itemTypeRepository;
    private SerializerInterface $serializer;

    public function __construct(ItemTypeRepository $itemTypeRepository, EntityManagerInterface $em, ItemRepository $itemRepository, SerializerInterface $serializer)
    {
        $this->em = $em;
        $this->itemRepository = $itemRepository;
        $this->serializer = $serializer;
        $this->itemTypeRepository = $itemTypeRepository;
    }

    public function createAll()
    {
        $objects = ['Loupe', 'Piège', 'Lunettes de Véra', 'Sac à dos de Scooby', 'Cape d\'invisibilité', 'Part de pizza', 'Boussole'];
        $existantObjects = $this->itemTypeRepository->findName();

        foreach ($objects as $object) {
            $key = array_search($object, array_column($existantObjects, "name"));

            if ($key === false) {
                $itemType = new ItemType;
                $itemType->setName($object);
                $this->em->persist($itemType);
            }
        }
        $this->em->flush();
    }

    public function save(Item $item)
    {
        $this->em->persist($item);
        $this->em->flush($item);
    }
}
